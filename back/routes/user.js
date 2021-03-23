const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');
const fs = require('fs'); // file system 조작 모듈
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path'); // node에서 기본 제공

const { User, Post, Comment, Image, Profile } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads/profile');
} catch (error) {
  console.error(error);
  fs.mkdirSync('uploads/profile');
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

// multer 세팅
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'react-snsbyjg-s3',
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
    }
  }),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20Mb
  },
});

// [load my info]
router.get('/', async (req, res, next) => {
  // console.log(req.headers);

  try {
    if (req.user) {
      const userWithoutPassword = await User.findOne({
        where: {
          id: req.user.id
        },
        attributes: {
          exclude: ['password'],
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }, {
          model: Profile,
          attributes: ['profileSrc', 'coverSrc'],
        }],
      });
      res.status(200).json(userWithoutPassword);
    } else {
      // 로그아웃 상태일 때
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [register user]
router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    });

    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }

    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });

    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [login]
router.post('/login', isNotLoggedIn, (req, res, next) => {
  // 라우터 내부에서 if(req.isAuthenticate()) 사용할 수 도 있지만 다른 라우터에서 중복이 많이 될 수 있으므로 미들웨어로 따로 생성
  passport.authenticate('local', (err, user, info) => {
    // 서버 에러인 경우
    if (err) {
      console.error(err);
      // express가 에러처리하도록 보냄
      // req, res, next를 사용하기 위해 '미들웨어 확장'! -> 익스프레스 기법 중 하나 (검색 필요)
      next(err);
    }
    if (info) {
      // 401 : Unauthorized (미인증, 비승인)
      return res.status(401).send(info.reason);
    }

    // 서비스 로그인 완료 후 패스포트 로그인 한 번 더 진행
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const userWithoutPassword = await User.findOne({
        where: {
          id: user.id
        },
        // 특정 컬럼만 가져오고 싶을 때 배열로 컬럼명 나열, 제외하고 싶으면 exclude: 사용
        attributes: {
          exclude: ['password'],
        },
        // myInfo 자체에는 다른 모델을 참조할 수 없으므로 include로 추가, 합침
        // hasMany 이므로 Post -> myInfo.Posts
        include: [{
          model: Post,
        }, {
          model: User,
          as: 'Followings',
        }, {
          model: User,
          as: 'Followers',
        }],
      });

      return res.status(200).json(userWithoutPassword);
    });
  })(req, res, next);
});

// [logout]
router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

// [change nickname]
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update({
      nickname: req.body.nickname,
    }, {
      where: { id: req.user.id }
    });

    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [load followings]
router.get('/followings', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      res.status(403).send('해당 유저가 존재하지 않습니다.');
    }
    const Followings = await user.getFollowings({
      limit: parseInt(req.query.limit, 10),
    });
    res.status(200).json(Followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [load followers]
router.get('/followers', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });

    if (!user) {
      res.status(403).send('해당 유저가 존재하지 않습니다.');
    }

    const Followers = await user.getFollowers({
      limit: parseInt(req.query.limit, 10),
    });

    res.status(200).json(Followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [register profile image]
router.post('/profile', isLoggedIn, upload.single('image'), async (req, res, next) => {
  try {
    const url = 'https://react-snsbyjg-s3.s3.ap-northeast-2.amazonaws.com/original/';
    const result = await Profile.findOrCreate({
      where: {
        UserId: req.user.id,
      },
      defaults: {
        profileSrc: req.file.location,
        UserId: req.user.id,
      }
    });

    if (!result[1]) {
      await Profile.update({
        profileSrc: req.file.location,
      }, {
        where: {
          UserId: req.user.id,
        }
      });
    }

    const profile = await Profile.findOne({
      where: { UserId: req.user.id },
      attributes: ['profileSrc'],
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [register cover image]
router.post('/cover', isLoggedIn, upload.single('image'), async (req, res, next) => {
  try {
    const url = 'https://react-snsbyjg-s3.s3.ap-northeast-2.amazonaws.com/original/';
    const result = await Profile.findOrCreate({
      where: {
        UserId: req.user.id,
      },
      defaults: {
        coverSrc: req.file.location,
        UserId: req.user.id,
      }
    });

    if (!result[1]) {
      await Profile.update({
        coverSrc: req.file.location,
      }, {
        where: {
          UserId: req.user.id,
        }
      });
    }

    const profile = await Profile.findOne({
      where: { UserId: req.user.id },
      attributes: ['coverSrc'],
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [remove follower] - 차단
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.userId, 10) },
    });
    if (!user) {
      res.status(403).send('해당 유저가 존재하지 않습니다.');
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [load user]
router.get('/:userId', async (req, res, next) => {
  try {
    const userWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: Post,
        attributes: ['id'],
      }, {
        model: User,
        as: 'Followings',
        attributes: ['id', 'nickname', 'email'],
      }, {
        model: User,
        as: 'Followers',
        attributes: ['id', 'nickname', 'email'],
      }, {
        model: Profile,
        attributes: ['profileSrc', 'coverSrc'],
      }]
    })
    if (userWithoutPassword) {
      // 시퀄라이즈가 반환한 데이터를 조작하기 위해 json으로 변경
      const data = userWithoutPassword.toJSON();

      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data);
    } else {
      res.status(404).json('존재하지 않는 사용자입니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [load user posts]
router.get('/:userId/posts', async (req, res, next) => {
  try {
    const where = {
      UserId: parseInt(req.params.userId, 10),
    };
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }
    }
    const allPostsLength = await Post.count({ where });
    const completePosts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'email'],
        include: [{
          model: Profile,
          attributes: ['profileSrc'],
        }],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'email'],
        }],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id', 'nickname', 'email'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'email'],
          include: [{
            model: Profile,
            attributes: ['profileSrc'],
          }],
        }, {
          model: Image,
        }],
      }],
    });

    return res.status(200).json({
      completePosts,
      allPostsLength,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [follow user]
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.userId, 10) },
    });
    if (!user) {
      res.status(403).send('해당 유저가 존재하지 않습니다.');
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [unfollow user]
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.userId, 10) },
    });
    if (!user) {
      res.status(403).send('해당 유저가 존재하지 않습니다.');
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;