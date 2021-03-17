// 로그인, 로그아웃 여부 확인 미들웨어 설정 -> 여부에 따라 페이지 접근, url 요청 제한하기 위해
// 커스텀 미들웨어, 미들웨어 기본 형태
exports.isLoggedIn = (req, res, next) => {
  // req.user로 검사도 가능 but passport에서 isAuthenticated() 제공
  // 로그인을 했을 경우
  if (req.isAuthenticated()) {
    // 파라미터를 설정하면 에러처리용이 되고, 그냥 사용하면 다음 미들웨어로 진행
    next();
  } else {
    res.status(401).send('로그인이 필요합니다');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  // req.user로 검사도 가능 but passport에서 isAuthenticated() 제공
  // 로그인을 했을 경우
  if (!req.isAuthenticated()) {
    // 파라미터를 설정하면 에러처리용이 되고, 그냥 사용하면 다음 미들웨어로 진행
    next();
  } else {
    res.status(401).send('로그인 하지 않은 사용자만 이용 가능합니다.');
  }
};