const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
  passport.use(new LocalStrategy({
    // req.body.email, password -> req.body 에 대한 설정
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    // 로그인 전략
    try {
      const user = await User.findOne({
        where: {
          email,
        }
      });
      if (!user) {
        // 서버측 에러, 성공, 클라이언트측 에러
        return done(null, false, { reason: '존재하지 않는 사용자입니다.' });
      }
      // req.body.password와 이메일이 같은 user 정보의 password 비교
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        // 로그인 성공 -> 성공 인자에 해당 user 정보 넘겨줌
        return done(null, user);
      }
      return done(null, false, { reason: '비밀번호가 일치하지 않습니다. ' });
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }));
};