const express = require('express');
const mongoose = require('mongoose');
const auth = require('./routes/auth')
require('./passport/passport')
const passport = require('passport')
const cookieSession = require("cookie-session");
const app = express();

//connect to DB
mongoose.connect("mongodb://127.0.0.1:27017/passport", () =>
    console.log("DB CONNECTED")
);

app.use(cookieSession({
    maxAge: 3 * 24 * 60 * 60 * 1000,
    keys: ["tokenkey"], // dotenv
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs')
app.use('/auth', auth)

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  }
  next();
};

app.get("/", isLoggedIn, (req, res) => {
    return res.render('home')
})


app.listen(3000, () => {
    console.log('Server is running...')
})

