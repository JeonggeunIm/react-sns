// dotenv는 .json 파일에서 사용 불가하므로 js로 변경
// .env 파일은 보안에 유의하여 사용함
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-sns",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-sns",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": process.env.DB_PASSWORD,
    "database": "react-sns",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
};