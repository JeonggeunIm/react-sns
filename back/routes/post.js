// import 와 동일
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path'); // node에서 기본 제공
const fs = require('fs'); // file system 조작 모듈

const { Post, User, Comment, Image, Hashtag, Profile } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.error(error);
  fs.mkdirSync('uploads');
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

// [add post]
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/(#[^\s#]+)/g);
    // create로 추가한 게시글이 객체로 반환됨
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    // 해쉬태그 등록
    if (hashtags) {
      // # 제거하고 공통적으로 소문자로 DB에 저장 & 중복되는 태그는 저장하지 않음(findOrCreate -> where 추가)
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      })));
      // await post.addImages(image); 와 차이가 생기는 이유
      // -> findOrCreate의 반환 값이 [['tag1', true],['tag2', true]] 이므로...! -> 반환 값 다시 확인해볼 것
      await post.addHashtags(result.map((v) => v[0]));
    }

    // 이미지 등록
    if (req.body.image) {
      // 이미지를 여러 개 올리면 배열로 반환됨 & 반환되는 요소는 Promise 객체들이므로 Promise.all()로 처리
      if (Array.isArray(req.body.image)) {
        // DB에 이미지 자체를 올리는 것이 아닌 주소를 넣어줌, CDN 캐싱도 불가하므로...
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImages(images); // Images 테이블에서 images에 해당하는 PostId에 post의 id를 넣는 건가..?? 
      } else { // 이미지가 하나인 경우
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

    // 데이터 조작 후 완성된 모델을 front에 전달해줘야 참조에러 나지 않음
    const completePost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Image,
      }, {
        model: User, // 게시글 작성자
        attributes: ['id', 'nickname', 'email'],
        include: [{
          model: Profile,
          attributes: ['profileSrc'],
        }],
      }, {
        model: Comment,
        include: [{
          model: User, // 댓글 작성자
          attributes: ['id', 'nickname', 'email'],
        }],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      },],
    });
    res.status(201).json(completePost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [upload images]
router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
  // console.log(req.files);
  res.json(req.files.map((v) => v.location));
});

// [load post]
router.get('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: parseInt(req.params.postId, 10) },
    });

    if (!post) {
      return res.status(404).send('존재하지 않는 게시글입니다.');
    }

    const completePost = await Post.findOne({
      where: {
        id: post.id,
      },
      include: [{
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
      }, {
        model: User,
        attributes: ['id', 'nickname', 'email'],
        include: [{
          model: Profile,
          attributes: ['profileSrc'],
        }],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id', 'nickname', 'email'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'email'],
          include: [{
            model: Profile,
            attributes: ['profileSrc'],
          }],
        }],
      }]
    });
    res.status(200).json(completePost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [delete post]
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id, // 본인 게시글만 삭제 가능
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [update post]
router.patch('/:postId', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/(#[^\s#]+)/g);
    await Post.update({
      content: req.body.content,
    }, {
      where: {
        id: req.params.postId,
        UserId: req.user.id, // 본인 게시글만 수정 가능
      },
    });
    const post = await Post.findOne({ where: { id: req.params.postId } });
    // 해쉬태그 등록
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() },
      })));
      await post.setHashtags(result.map((v) => v[0]));
    }
    // 이미지 등록
    if (req.body.image) {
      // 이미지를 여러 개 올리면 배열로 반환됨 & 반환되는 요소는 Promise 객체들이므로 Promise.all()로 처리
      if (Array.isArray(req.body.image)) {
        // DB에 이미지 자체를 올리는 것이 아닌 주소를 넣어줌, CDN 캐싱도 불가하므로...
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.setImages(images);
      } else { // 이미지가 하나인 경우
        const image = await Image.create({ src: req.body.image });
        await post.setImages(image);
      }
    } else {
      await post.setImages([]);
    }
    const completeImages = await Image.findAll({
      where: { PostId: post.id },
    });
    // console.log(completeImages);
    res.status(200).json({
      PostId: parseInt(req.params.postId, 10),
      content: req.body.content,
      images: completeImages,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [add comment]
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    // 존재하지 않는 게시글에 comment 요청 방지
    const post = await Post.findOne({
      id: req.params.postId,
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });

    const completeComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname', 'email'],
        include: [{
          model: Profile,
          attributes: ['profileSrc'],
        }],
      }],
    });

    res.status(201).json(completeComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [like post]
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id);
    res.status(201).json({
      PostId: post.id,
      UserId: req.user.id,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [unlike post]
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.status(201).json({
      PostId: post.id,
      UserId: req.user.id,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// [retweet post]
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: parseInt(req.params.postId, 10) },
      include: [{
        model: Post,
        as: 'Retweet',
      }],
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    // 본인 게시글이나 다른 사람이 리트윗한 본인 게시글은 리트윗할 수 없도록 설정
    if (req.user.id === post.UserId || post.Retweet && post.Retweet.UserId === req.user.id) {
      return res.status(403).send('본인 게시글은 리트윗 할 수 없습니다.');
    }
    // 리트윗된 게시글이면 원본 게시글을 리트윗
    const retweetTargetId = post.RetweetId || post.id;
    const exRetweeted = await Post.findOne({
      where: {
        id: req.user.id,
        RetweetId: retweetTargetId,
      },
    });

    if (exRetweeted) {
      return res.status(403).send('이미 리트윗한 게시글입니다.');
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'Retweeted Post',
    });

    const retweetWithPrevPost = await Post.findOne({
      where: {
        id: retweet.id,
      },
      include: [{
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
      }, {
        model: User,
        attributes: ['id', 'nickname', 'email'],
        include: [{
          model: Profile,
          attributes: ['profileSrc'],
        }],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'email'],
        }],
      }]
    });
    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;