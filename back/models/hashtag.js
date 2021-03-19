const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Hashtag extends Model {
  static init(sequelize) {
    // Model의 init을 호출해줘야 테이블 생성 가능 
    return super.init({
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    }, {
      modelName: 'Hashtag',
      tableName: 'hashtags',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize, // index.js에서 연결 객체에 사용될 sequelize를 보내줌
    });
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Hashtag = sequelize.define('Hashtag', {
//     name: {
//       type: DataTypes.STRING(20),
//       allowNull: false,
//     },
//   }, {
//     charset: 'utf8mb4',
//     collate: 'utf8mb4_general_ci'
//   });
//   Hashtag.associate = (db) => {
//     // ex. User 와 UserInfo는 hasOne, belongsTo -> belongsTo 는 외래키 설정하는 테이블에!
//     // M : N
//     db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
//   };

//   return Hashtag;
// };