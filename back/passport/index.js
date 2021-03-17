const passport = require('passport');

const local = require('./local');
const { User } = require('../models');

module.exports = () => {
  // req.login() 후 실행 & 파라미터로 user, done 받아옴
  passport.serializeUser((user, done) => {
    // 쿠키와 묶어줄 아이디만 저장하는 것
    done(null, user.id);
  });

  // 로그인 후 두 번째 요청부터는 라우터 실행 전 매번 deserializeUser 실행
  passport.deserializeUser(async (id, done) => {
    try {
      // 쿠키와 함께 저장했던 아이디를 사용하여 DB에서 user 정보 찾아 전달
      const user = await User.findOne({
        where: { id },
      });
      done(null, user); // *** req.user로 user 전달 ***
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};