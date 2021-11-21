const BigPromise = require('../middlewares/bigPromise')
const User = require('../models/User')
const { CustomError,cookieToken } = require('../utils/CustomError')

exports.signup = BigPromise(async (req, res, next) => {
    const { name, email, password } = req.body;

    if(!email || !name || !password){
        return next(new CustomError('Name, email and password are required',400))
    }  

    const user = await User.create({
        name,
        email,
        password
    })

    cookieToken(user, res);
    
})

