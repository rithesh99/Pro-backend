const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// from node
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [40, 'Name should be under 40 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        validate: [validator.isEmail, 'Please provide a valid email'],
        unique: [true, 'Email already exists']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be atleast 6 characters long'],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    photo: {
        id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//encrypt password before save 
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) 
        return next();
    this.password = await bcrypt.hash(this.password, 10)
})

//validate password
userSchema.methods.isValidatePassword = async function(userPassword){
    return await bcrypt.compare(userPassword, this.password)
}

//create and return token
userSchema.methods.getToken = async function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET,{ expiresIn: process.env.JWT_EXPIRY })
}

//generate forgot password token(string)
userSchema.methods.getForgotPasswprdToken = async function(){
    //generate a long and random string
    const forgotToken = crypto.randomBytes(10).toString('hex');
    
    // getting a hash - make sure to get a hash on backend
    this.forgotPasswordToken = crypto
    .createHash('sha256')
    .update(forgotToken)
    .digest('hex');
    
    //time of token
    this.forgotPasswordExpiry = process.env.FORGET_PASSWORD_EXPIRY
    
    return forgotToken;
}

module.exports = mongoose.model('User', userSchema)