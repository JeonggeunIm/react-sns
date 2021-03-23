const Sequelize = require('sequelize');
const user = require('./user');
const post = require('./post');
const image = require('./image');
const comment = require('./comment');
const hashtag = require('./hashtag');
const profile = require('./profile');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const db = {};
// mySQL과 node 연결
const sequelize = new Sequelize(config.database, config.username, config.password, config);
// db 객체에 model 등록
db.User = user;
db.Post = post;
db.Image = image;
db.Comment = comment;
db.Hashtag = hashtag;
db.Profile = profile;

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
