require('dotenv').config();
require('./config/database').connect();
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
 
const User = require('./models/user');
const auth = require('./middlewares/auth');

const app = express()
app.use(cookieParser())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Hello from Auth</h1>")
})

app.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        if (!(email && password && firstname && lastname)) {
            return res.status(400).send("Please enter all fields !!!");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).send("User with this emial name already exists");
        }

        const encryptPassword = await bcrypt.hash(password, 10)

        //------------------NEW USER CREATION------------------
        // const newUser = await User.create({
        //     firstname,
        //     lastname,
        //     email: email.toLowerCase(),
        //     password: encryptPassword
        // })
        //------------------ENDS------------------

        //------------------NEW USER CREATION------------------
        const newUser = new User({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: encryptPassword
        })
        await newUser.save();
        //------------------ENDS------------------

        const token = jwt.sign(
            {
                user_id: newUser._id
            },
            process.env.SECRET,
            {
                expiresIn: "12h"
            }
        );
        newUser.token = token;
        //update or not in DB


        newUser.password = undefined; // handle password
        console.log(newUser);
        return res.status(201).send("User created successfully")
    } catch (error) {
        console.log(error)
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(400).send("Enter valid credentials");
    }
    await User.findOne({ email })
        .then(async user => {
            if (!user) {
                return res.status(401).send("Enter valid credentials");
            }
            await bcrypt.compare(password, user.password)
                .then(response => {
                    if (response) {
                        const token = jwt.sign(
                            {
                                user_id: user._id
                            },
                            process.env.SECRET,
                            {
                                expiresIn: "12h"
                            }
                        );
                        user.token = token;
                        user.password = undefined;
                        console.log(user)
                        const options = {
                            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                            httpOnly: true
                        }
                        return res.status(200).cookie('token', token, options).json({
                            "success": true,
                            "token": token,
                            "user": user
                        })
                        //return res.status(200).send("Login successfull")
                    }
                    return res.status(400).send("Password incorrect")
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log("ERROR ", err);
        })
})

app.get("/dashboard", auth, (req, res) => {
    res.send("<h1>Hello from Dashborad</h1>")
})

app.get("/logout", (req, res) => {
    res.clearCookie('token');
    return res.send("Signed out succesfully");
})

module.exports = app