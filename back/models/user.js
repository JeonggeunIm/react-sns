const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    // Model의 init을 호출해줘야 테이블 생성 가능 
    return super.init({
      email: {
        type: DataTypes.STRING(50),
        allowNull: false, // 필수 값
        unique: true, // 고유 값
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    }, {
      modelName: 'User',
      tableName: 'users',
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize, // index.js에서 연결 객체에 사용될 sequelize를 보내줌
    });
  }

  static associate(db) {
    db.User.hasOne(db.Profile);
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
  }
};

// // model 의 기본 형태
// module.exports = (sequelize, DataTypes) => {
//   // model명은 대문자, seq을 통해 생성되는 table명은 소문자 + 복수형 => 'users'
//   const User = sequelize.define('User', {
//     // id 1,2,3,4... 기본적으로 생성
//     // 컬럼 (column)
//     email: {
//       // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME ...
//       type: DataTypes.STRING(50),
//       allowNull: false, // 필수 값
//       unique: true, // 고유 값
//     },
//     nickname: {
//       type: DataTypes.STRING(20),
//       allowNull: false,
//     },
//     password: {
//       // 암호화되면 길어지므로 넉넉히 설정
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//   }, {
//     // 한글 데이터 다루기 위한 설정
//     charset: 'utf8',
//     collate: 'utf8_general_ci'
//   });
//   // RDBMS 테이블 간 관계 설정
//   User.associate = (db) => {
//     // 유저 한 명이 여러 개의 포스트를 작성할 수 있음
//     db.User.hasMany(db.Post);
//     db.User.hasMany(db.Comment);
//     db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
//     // 같은 테이블 내에서 서로를 참조할 때는 foreignKey를 사용해야 함 
//     // -> UserId가 두 번 생기므로 followingId, follwerId로 지정
//     db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
//     db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
//   };

//   return User;
// };