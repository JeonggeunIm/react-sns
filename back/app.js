const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const hpp = require('hpp');
const helmet = require('helmet');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');

const app = express();
const port = process.env.NODE_ENV === 'production' ? 80 : 3065;
passportConfig();
// process.env. 으로 접근하기 위해 호출
dotenv.config();

app.use(express.json()); // json 데이터 처리
app.use(express.urlencoded({ extended: true })); // form 데이터 처리
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    domain: process.env.NODE_ENV === 'production' && '.snsbyjg.website',
  }
}));
app.use(passport.initialize());
app.use(passport.session());
// front에 uploads 폴더를 제공 할 수 있도록 -> __dirname: 현재 폴더(back) 와 'uploads' 경로를 합쳐줌
app.use('/', express.static(path.join(__dirname, 'uploads')));

// express에서 sequelize 등록
db.sequelize.sync({
  // alter: true,
})
  .then(() => {
    console.log('DB is connected');
  })
  .catch(console.error);

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet());

  app.use(cors({
    origin: ['http://snsbyjg.website'],
    credentials: true,
  }));
} else {
  app.use(morgan('dev'));
  app.use(cors({
    origin: true,
    credentials: true,
  }));
}

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

// prefix
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

// port 지정
app.listen(port, () => {
  console.log('executing server....');
});