const passport = require('passport');

// Google Sign-In route
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google Sign-In callback route
exports.googleCallback = [
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.json({ token: req.user.token });
  }
];
