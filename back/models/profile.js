const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Profile extends Model {
  static init(sequelize) {
    // Model의 init을 호출해줘야 테이블 생성 가능 
    return super.init({
      introduction: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      profileSrc: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      coverSrc: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    }, {
      modelName: 'Profile',
      tableName: 'Profiles',
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize, // index.js에서 연결 객체에 사용될 sequelize를 보내줌
    });
  }

  static associate(db) {
    db.Image.belongsTo(db.User);
  }
};