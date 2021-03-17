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
    // 쿼리스트링의 값을 받아옴
    if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
      // 초기엔 &lt 로 작성하였으나 SQL Injection 문제의 가능성이 있어 수정
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) } // lastId 보다 작은 id
    }
    const allPostsLength = await Post.count();
    console.log(allPostsLength);
    const completePosts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      // => 최신 게시물부터.. 2차원 배열인 이유 : 여러 기준으로 정렬할 수 있기 때문에
      // => offset: 0 -> id 기준 1~10 까지 가져옴. 실무에서 잘 사용하지 않음 
      // => 게시글 불러올 때 게시글 추가, 삭제가 이뤄지는 경우 limit, offset이 꼬여서 중복으로 불러오거나 누락하는 경우 발생
      // => where: { id: lastId } -> 구현 -> 마지막으로 불러온 게시글 id를 저장(고정)하여 그 다음부터 가져와 중복, 누락 방지
      // -> 게시판의 Pagination과도 동일한 원리
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
        // 미리 넣어줘야 load 할 때 참조 오류 안 생김
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
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

module.exports = router;