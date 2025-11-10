const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = express.Router();

// Configure Passport Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    function (accessToken, refreshToken, profile, done) {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : ''
      };
      return done(null, user);
    }
  )
);

// serialize / deserialize
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Auth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/profile')
);

// logout route
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(function () {
      res.clearCookie('connect.sid', { path: '/' });
      res.redirect('/');
    });
  });
});

module.exports = router;