exports.isLoggedIn = (req, res, next) => {
  // 로그인을 했을 경우
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인이 필요합니다');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('이미 로그인 되어 있습니다.');
  }
};