const jwt = require('jsonwebtoken');

const { JWT_KEY } = process.env;

module.exports = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, JWT_KEY, null);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'giriş geçersiz',
    });
  }
};
