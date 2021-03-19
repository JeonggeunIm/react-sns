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

// 한번 호출해줘야 함
const app = express();
passportConfig();
// process.env. 으로 접근하기 위해 호출
dotenv.config();

// use()는 express 서버에 미들웨어 장착
// 프론트에서 보낸 data를 해석해서 req.body에 담아주는 역할 => 라우트 설정 전에 선언해야 됨
app.use(express.json()); // json 데이터 처리
app.use(express.urlencoded({ extended: true })); // form 데이터 처리
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  // 쿠키와 시크릿 문자열을 알면 세션이 노출될 수 있으므로 잘 숨겨 놓아야 함
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());
// front에 uploads 폴더를 제공 할 수 있도록 -> __dirname: 현재 폴더(back) 와 'uploads' 경로를 합쳐줌
// => 'back/uploads' 생성 -> 문자열 결합 + 를 직접적으로 사용하지 않는 이유는 운영체제에 따라 경로 구분이 '/' '\' 등으로 다르기 때문에 
// node에선 경로를 합칠 때 path.join()을 사용한다.
// 첫 번째 인자는 시작 경로이므로 '/' 시 localhost:3065가 됨
app.use('/', express.static(path.join(__dirname, 'uploads')));

// res.setHeader('Access-Control-Allow-Origin', '*');와 동일한 처리
// app.use(cors());
// 헤커들의 요청까지 허용하면 안되므로 origin으로 요청 허용할 url 지정
app.use(cors({
  // origin: true 설정 -> * 대신 요청을 보낸 곳의 주소가 자동으로 들어가 편리
  origin: ['http://localhost:3060', 'snsbyjg.com', 'http://54.180.108.6'],
  // true여야 다른 도메인 간 쿠키 전송 가능 -> res.setHeader("Access-Control-Allow-Credentials", "true");
  credentials: true, // 기본 값 false
}));

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
} else {
  app.use(morgan('dev'));
}
// app.method('url', cb)
// 주소창에 입력해서 요청하는 건 GET 요청
app.get('/', (req, res) => {
  res.send('Hello Express!'); // http의 end와 동일
});
// app.get('/api', (req, res) => {
//   res.send('Hello API!');
// });

// postRouter에 '/post' url prefix
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

// *** 해당 위치가 next(err) 했을 경우 전달되는 미들웨어 자리
// 기본적으로 내장되어 있지만 따로 커스텀이 필요한 경우 아래와 같이 사용
// 에러 정보를 선별적으로 전달하거나, 에러화면을 따로 띄워 주고 싶을 때 등 사용
// app.use((err, req, res, next) => {

// });

// port 지정
app.listen(80, () => {
  console.log('executing server....');
});