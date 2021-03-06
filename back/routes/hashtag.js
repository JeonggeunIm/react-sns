const express = require('express');
const router = express.Router();

const { Post, Hashtag, User, Image, Comment, Profile } = require('../models');

// [load hashtag posts]
router.get('/:hashtag', async (req, res, next) => {
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) } // lastId 보다 작은 id
    }
    // console.log(req.params.hashtag);
    const completePosts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: Hashtag,
        where: {
          name: decodeURIComponent(req.params.hashtag),
        },
      }, {
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
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname', 'email'],
        }, {
          model: Image,
        }],
      }],
    });
    const allPostsLength = completePosts.length;

    return res.status(200).json({ 
      completePosts, 
      allPostsLength,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;