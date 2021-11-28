const passport = require('passport')

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "399299992717-nmcoofd2j1urnsame5u6ejecu2pmsfir.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  (accessToken, refreshToken, profile, next) => {
    console.log('MY PROFILE', profile)
    next();
  }
));