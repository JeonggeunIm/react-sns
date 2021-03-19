const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Post extends Model {
  static init(sequelize) {
    // Model의 init을 호출해줘야 테이블 생성 가능 
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      modelName: 'Post',
      tableName: 'posts',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize, // index.js에서 연결 객체에 사용될 sequelize를 보내줌
    });
  }

  static associate(db) {
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    db.Post.belongsTo(db.Post, { as: 'Retweet' });
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Post = sequelize.define('Post', {
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//   }, {
//     // mb4는 이모티콘도 사용 가능
//     charset: 'utf8mb4',
//     collate: 'utf8mb4_general_ci'
//   });
//   Post.associate = (db) => {
//     // 관계 설정 시 시퀄라이즈에서 add, remove, get, set 메서드 제공 
//     db.Post.hasMany(db.Comment);
//     db.Post.hasMany(db.Image); // -> post.addImages, post.removeImages, (hasMany 이므로 복수형태)
//     // 포스트는 유저에 속해있다.
//     db.Post.belongsTo(db.User);
//     // PostHashtag 매핑 테이블 생성됨 (다대다)
//     db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
//     // 매핑 테이블의 이름을 두번째 파라미터의 through로 지정할 수 있음, 반대 쪽에도 지정을 해야함
//     // post.getLikers 로 좋아요 누른 사람 가져옴 (as 검색)
//     db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); // -> post.addLikers, post.removeLikers
//     // 원본 & 리트윗 된 포스트들 (일대다)
//     db.Post.belongsTo(db.Post, { as: 'Retweet' }); // -> post.Retweet, post.addRetweet, post.removeRetweet (단수)
//   };

//   return Post;
// };