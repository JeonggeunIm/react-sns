const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Profile extends Model {
  static init(sequelize) {
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
      tableName: 'profiles',
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    });
  }

  static associate(db) {
    db.Image.belongsTo(db.User);
  }
};