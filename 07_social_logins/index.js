const express = require('express');
const mongoose = require('mongoose');
const auth = require('./routes/auth')
require('./passport/passport')
const passport = require('passport')
const app = express();

//connect to DB
mongoose.connect("mongodb://127.0.0.1:27017/passport", () =>
    console.log("DB CONNECTED")
);

app.use(passport.initialize());

app.set('view engine', 'ejs')
app.use('/auth', auth)

app.get("/", (req, res) => {
    return res.render('home')
})


app.listen(3000, () => {
    console.log('Server is running...')
})