const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  // Token is expected in 'Bearer <token>' format
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized! Token is invalid or has expired.' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole === 'Admin') {
    next();
    return;
  }
  res.status(403).send({ message: 'Require Admin Role!' });
};

const isAirline = (req, res, next) => {
  if (req.userRole === 'Airline') {
    next();
    return;
  }
  res.status(403).send({ message: 'Require Airline Role!' });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isAirline,
};

module.exports = authJwt; 