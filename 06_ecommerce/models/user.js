const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new monggose.Schema({
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
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
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

module.exports = mongoose.model('User', userSchema)