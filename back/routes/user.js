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
// multer 세팅
// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, cb) {
//       cb(null, 'uploads/profile');
//     },
//     filename(req, file, cb) {
//       const ext = path.extname(file.originalname); // 확장자 추출
//       const basename = path.basename(file.originalname, ext); // 파일명 추출
//       cb(null, basename + '_' + new Date().getTime() + ext); // => 파일명_38023932.확장자
//     },
//   }),
//   limits: {
//     fileSize: 20 * 1024 * 1024 // 20Mb
//   },
// });

//! [load my info]
// 새로고침 시 매번 요청
router.get('/', async (req, res, next) => {
  console.log(req.headers);
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
          // 카운트에 필요한 정보이므로 굳이 다른 내용까지 메모리 낭비해가며 가져올 필요 없음 -> 데이터 효율
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

// POST /user
// app.js의 prefix 와 합쳐져서 POST, /user 로 라우팅
router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    // 비밀번호 암호화, 두 번째 숫자는 암호화된 자릿 수로 10 ~ 13 정도를 사용하지만 성능에 따라 다르게 설정 (높을수록 보안엔 좋으나 처리속도가 오래 걸릴 수 있음)
    // bcrypt도 비동기이므로 await 붙일 것 -> 비동기인지 아닌지는 공식문서 확인
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // model에서 조건에 맞는 데이터 찾고, 없으면 null 반환 
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
    if (exUser) {
      // return을 하지 않을 시 res.send('ok'); 도 실행되므로 응답을 두 번 보내게 되므로 일대일 관계 무너짐
      // send 두 번 이상 보낼 시 can't set headers already sent 에러
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    // .create() : 테이블에 데이터 삽입 (비동기 함수)
    // res.json이 먼저 실행되는 것을 방지하기 위해 await 사용 
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    // // 3000port로 온 요청은 허용하겠다. (차단은 브라우저가, 허용은 서버가 함)
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // // 모든 요청 허용
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // 201 : 데이터가 잘 생성되어 요청 성공
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    // 설명 필요
    next(error); // status(500)
  }
});

// POST /user/login
// 두 번째 콜백 파라미터는 done에서 받아옴
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

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

// [change nickname]
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    // 첫 번째 : 바꿀 필드, 두 번째 : 조건
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
    // findAll 사용하지 않은 이유, Followers가 어떤 type으로 반환되는지 생각해볼 것
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
    console.log('#####이미지' + req.file.filename, req.user.id);
    const result = await Profile.findOrCreate({
      where: {
        UserId: req.user.id,
      },
      defaults: {
        profileSrc: req.file.filename,
        UserId: req.user.id,
      }
    });
    console.log('#####생성 여부' + result[1]);
    if (!result[1]) {
      await Profile.update({
        profileSrc: req.file.filename,
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
    console.log('#####이미지' + req.file.filename, req.user.id);
    const result = await Profile.findOrCreate({
      where: {
        UserId: req.user.id,
      },
      defaults: {
        coverSrc: req.file.filename,
        UserId: req.user.id,
      }
    });
    console.log('#####생성 여부' + result[1]);
    if (!result[1]) {
      await Profile.update({
        coverSrc: req.file.filename,
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
router.get('/:userId', async (req, res, next) => { // GET /user/1
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

      // 개수로만 데이터를 갈아끼움 id는 없어지도록
      data.Posts = data.Posts.length; // 개인정보 침해 예방
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
    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
      // 초기엔 &lt 로 작성하였으나 SQL Injection 문제의 가능성이 있어 수정
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) } // lastId 보다 작은 id
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
        attributes: ['id', 'nickname', 'email'], // password 제외
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
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id', 'nickname', 'email'],
      }, {
        model: Post,
        as: 'Retweet', // -> post.Retweet으로 담김
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



// [upload images]
// upload.array('image'): 이미지 여러 장, .single('image'): 이미지 한 장, .none(): 텍스트, fields?, fills? 인풋이 여러 개 일 때
// imageFormData.append('image', file); 의 key 값과 array()의 파라미터 값이 같아야 찾을 수 있음
// router.post('/image', isLoggedIn, upload.single('image'), (req, res, next) => {
//   // 이미지 업로드 후에 실행
//   console.log(req.file);
//   // res.json(req.files.map((v) => v.filename));
//   res.status(201).json(req.file.filename);
// });

module.exports = router;