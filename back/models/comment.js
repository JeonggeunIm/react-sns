const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {
  static init(sequelize) {
    // Model의 init을 호출해줘야 테이블 생성 가능 
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      modelName: 'Comment',
      tableName: 'Comments',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize, // index.js에서 연결 객체에 사용될 sequelize를 보내줌
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Comment = sequelize.define('Comment', {
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//   }, {
//     // mb4는 이모티콘도 사용 가능
//     charset: 'utf8mb4',
//     collate: 'utf8mb4_general_ci'
//   });
//   Comment.associate = (db) => {
//     // belongsTo => UserId(User model의 id), PostId(Post model의 id) 컬럼 생성 -> 아마도 외래키 설정?
//     db.Comment.belongsTo(db.User);
//     db.Comment.belongsTo(db.Post);
//   };

//   return Comment;
// };