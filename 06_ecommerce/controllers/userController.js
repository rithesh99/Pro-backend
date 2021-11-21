const BigPromise = require('../middlewares/bigPromise')
const User = require('../models/User')

exports.signup = BigPromise(async (req, res) => {
    const { name, email, password, role, photo } = req.body;
    res.send(req.body)    
})

