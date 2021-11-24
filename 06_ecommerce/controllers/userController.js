const BigPromise = require('../middlewares/bigPromise')
const User = require('../models/User')
const CustomError = require('../utils/customError')
const cookieToken = require('../utils/cookieToken')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const mailHelper = require('../utils/emailHelper')
const crypto = require('crypto')

exports.signup = BigPromise(async (req, res, next) => {

    if (!req.files) {
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
    if (!email || !password) {
        return next(new CustomError("Enter valid credentials", 400))
    }

    //get user from DB
    const user = await User.findOne({ email }).select("+password")

    //if user not found
    if (!user) {
        return next(new CustomError("Email not registered", 400))
    }

    //validate password
    const isPasswordCorrect = await user.isValidPassword(password);

    //incorrect password
    if (!isPasswordCorrect) {
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

exports.forgotPassword = BigPromise(async (req, res, next) => {
    //collect email
    const { email } = req.body;

    //find user in DB
    const user = await User.findOne({ email })
    // if user not found in DB
    if (!user) {
        return next(new CustomError('Email not found', 400))
    }

    //get token from user model methods
    const forgotToken = await user.getForgotPasswordToken();
    //save token from user model methods
    await user.save({ validateBeforeSave: false });

    // create an URL
    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

    //craft a message
    const message = `Copy paste this link in your url and hit enter \n\n ${myUrl}`

    try {
        // attempt to send email
        await mailHelper({
            email: user.email,
            subject: "Ecommerce - Password reset email",
            message
        })
        //json response if email is success
        return res.status(200).json({
            success: true,
            message: "Email sent successfully"
        })
    } catch (error) {
        // reset fields if things goes wrong
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new CustomError(error, 500))
    }
})

exports.resetPassword = BigPromise(async (req, res, next) => {

    const token = req.params.token;

    const encryptToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        forgotPasswordToken: encryptToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return next(new CustomError("Token is invalid or expired", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new CustomError("Password and cnfirm password does't match ", 400))
    }

    user.password = req.body.password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    // send a JSON response or send token
    cookieToken(user, res);
})

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
    //req.user will be added by middleware
    //find user by id
    const user = await User.findById(req.user.id)
    //send response and user data
    return res.status(200).json({
        success: true,
        user
    })
})

exports.changePassword = BigPromise(async (req, res, next) => {
    const { oldpassword, newpassword } = req.body;

    if (!oldpassword || !newpassword) {
        return next(new CustomError("Please enter the required fields", 400))
    }

    //get user from DB
    const user = await User.findById(req.user.id).select("+password")

    //if user not found
    if (!user) {
        return next(new CustomError("User not found", 400))
    }

    //validate password
    const isOldPasswordCorrect = await user.isValidPassword(req.body.oldpassword);

    //incorrect password
    if (!isOldPasswordCorrect) {
        return next(new CustomError("Old password doesn't match", 400))
    }

    user.password = req.body.newpassword
    await user.save();

    cookieToken(user, res);
})

exports.updateUserDetails = BigPromise(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email
    }
    if (req.files && req.files.photo !== '') {
        const user = await User.findById(req.user.id)

        const imageId = user.photo.id
        //Delete photo on cloudinary
        const response = await cloudinary.uploader.destroy(imageId)

        //upload new photo
        let file = req.files.photo; //single object
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'Users',
            width: 150,
            crop: "scale"
        });
        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }
    //get user from DB
    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    return res.status(200).json({
        success: true
    })
})

exports.adminAllUser = BigPromise(async (req, res, next) => {
    const users = await User.find();
    return res.status(200).json({
        success: true,
        users
    })
})
