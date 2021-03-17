// 'use strict';

// const fs = require('fs');
// const path = require('path');
const Sequelize = require('sequelize');
const user = require('./user');
const post = require('./post');
const image = require('./image');
const comment = require('./comment');
const hashtag = require('./hashtag');
const profile = require('./profile');

// const basename = path.basename(__filename);
// 배포할 땐 process.env.NODE_ENV가 'production' 으로 바뀌고 기본 값은 'development'
const env = process.env.NODE_ENV || 'development';
// config.json의 "development": {...} 중 ... 값을 가져오는 의미 -> env('development'의 value를 config에 저장)
// const config = require(__dirname + '/../config/config.json')[env];
const config = require('../config/config.js')[env];
const db = {};
// mySQL과 node 연결
const sequelize = new Sequelize(config.database, config.username, config.password, config);
// db 객체에 model 등록
// db.User = require('./user')(sequelize, Sequelize);
// db.Post = require('./post')(sequelize, Sequelize);
// db.Image = require('./image')(sequelize, Sequelize);
// db.Comment = require('./comment')(sequelize, Sequelize);
// db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.User = user;
db.Post = post;
db.Image = image;
db.Comment = comment;
db.Hashtag = hashtag;
db.Profile = profile;

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

Object.keys(db).forEach(modelName => {
  db[modelName].init(sequelize);
});

// db에 등록된 model을 순회하며 관계(associate) 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
