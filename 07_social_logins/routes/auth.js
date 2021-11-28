const router = require("express").Router();
const passport = require('passport')

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/google", 
    passport.authenticate('google', 
    {
        scope: ['profile', 'email']
    }),
    (req, res) => {
        res.send("Login with google");
});

router.get("/google/callback", passport.authenticate('google'), (req, res) => {
    res.send(req.user);
});

module.exports = router;
