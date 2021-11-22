const BigPromise = require('../middlewares/bigPromise')
const User = require('../models/User')
const CustomError = require('../utils/customError')
const cookieToken = require('../utils/cookieToken')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

exports.signup = BigPromise(async (req, res, next) => {
    
    if(!req.files){
        return next(CustomError("Photo is required for signup", 400));
    }

    const { name, email, password } = req.body;

    if (!email || !name || !password) {
        return next(new CustomError('Name, email and password are required', 400))
    }

    let file = req.files.photo; //single object
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'Users',
        width: 150,
        crop: "scale"
    });

    const user = await User.create({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    })

    cookieToken(user, res);

})

exports.login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body;

    //check email and password presence
    if(!email || !password){
        return next(new CustomError("Enter valid credentials", 400))
    }

    //get user from DB
    const user = await User.findOne({ email }).select("+password")
  
    //if user not found
    if(!user){
        return next(new CustomError("Email not registered", 400))
    }
    
    //validate password
    const isPasswordCorrect = await user.isValidPassword(password);

    //incorrect password
    if(!isPasswordCorrect){
        return next(new CustomError("Password doesn't match", 400))
    }

    
    cookieToken(user, res);

})

exports.logout = BigPromise(async (req, res, next) => {
    // res.clearCookie("token");
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    return res.status(200).json({
        success: true,
        message: "Logout success"
    })
})

