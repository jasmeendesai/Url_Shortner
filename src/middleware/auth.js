const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    let token = req.headers.authorization;
    token=token.replace("Bearer","").trim()

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); 
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); 
  }
};

module.exports = authenticateJWT;
