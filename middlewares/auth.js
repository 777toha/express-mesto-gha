const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
    next();
  } catch (e) {
    const err = new Error('Необходима авторизация');
    err.statusCode = 401;

    next(err);
  }
};

module.exports = {
  auth,
};
