const express = require('express');
const { Op } = require('sequelize'); // Operater

const { Post, User, Image, Comment, Profile } = require('../models');

const router = express.Router();

// [load posts]
router.get('/', async (req, res, next) => {
  try {
    // const followings = await User.findAll({
    //   attributes: ['id'],
    //   include: [{
    //     model: User,
    //     as: 'Followers',
    //     where: { id: req.user.id },
    //   }],
    // });
    // const where = {
    //   UserId: { [Op.in]: followings.map((v) => v.id) }
    // };
    const where = {};

    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) } // lastId 보다 작은 id
    }
    const allPostsLength = await Post.count();
    // console.log(allPostsLength);
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
        model: User,
        as: 'Likers',
        attributes: ['id'],
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

module.exports = router;