const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

require('dotenv').config()

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = process.env


module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value
        });
        await user.save();
      }

      const payload = { id: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

      done(null, { user, token });
    } catch (err) {
      done(err, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
