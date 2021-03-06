const passport = require("passport");
const User = require("../models/user");

var GoogleStrategy = require("passport-google-oauth20").Strategy;

//setting cookie
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//verifying cookie
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: "399299992717-nmcoofd2j1urnsame5u6ejecu2pmsfir.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    (accessToken, refreshToken, profile, next) => {
      console.log("MY PROFILE", profile._json.email);
      User.findOne({ email: profile._json.email }).then((user) => {
        if (user) {
          console.log("User already exits in DB", user);
          next(null, user);
          // cookietoken()
        } else {
          User.create({
            name: profile.displayName,
            googleId: profile.id,
            email: profile._json.email
          })
            .then((user) => {
              console.log("New User", user);
              next(null, user);
              // cookietoken()
            })
            .catch((err) => console.log(err));
        }
      });

      //   next();
    }
  )
);
