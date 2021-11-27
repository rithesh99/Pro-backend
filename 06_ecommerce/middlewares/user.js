const BigPromise = require('../middlewares/bigPromise')
const User = require('../models/user')
const CustomError = require('../utils/customError')
const jwt = require('jsonwebtoken')

exports.isLoggedIn = BigPromise(async (req, res, next) => {
    const token = req.cookies.token || (req.header('Authorization') && req.header('Authorization').replace("Bearer ", ""))
    if (!token) {
        return next(new CustomError("Login first to access this page", 401))
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    //my property - middleware
    req.user = await User.findById(decoded.id)
    next();
})

exports.customRole = (...roles) => BigPromise(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new CustomError("You are not allowed to access this page", 403))
    }
    next();
})