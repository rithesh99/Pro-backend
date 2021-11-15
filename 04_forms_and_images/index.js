require('dotenv').config()
const express = require('express')
const app = express();
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || 'dgqwl8lk9',
    api_key: process.env.CLOUD_KEY || '975443643924516',
    api_secret: process.env.CLOUD_SECRET || '8y9kRExx68A4mkxrybRRBqPpAFU'
});

app.set('view engine', 'ejs');

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.get("/getroute", (req, res) => {
    return res.send(req.query)
})

app.post("/postroute", async (req, res) => {
    console.log(req.body)   // firstname and lastname
    console.log(req.files)  // profilepic

    try {

        //Multiple files
        let imageArray = [];
        let files = req.files.profilepics; //array of objects
        console.log("MULTIPLE FILES ", files)
        if (files) {
            for (let index = 0; index < files.length; index++) {
                let result = await cloudinary.uploader.upload(files[index].tempFilePath, {
                    folder: "Users"
                })
                imageArray.push({
                    public_id: result.public_id,
                    secure_url: result.secure_url
                })
            }
        }

        //Single file
        let file = req.files.profilepic; //single object
        console.log("SINGLE FILE ", file)
        result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'Users'
        });

        details = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            result,
            imageArray
        }

        return res.send(details)
    } catch (error) {
        console.log(error)
    }


})

app.get("/getform", (req, res) => {
    //searches default in views folder
    return res.render('getform')
})

app.get("/postform", (req, res) => {
    //searches default in views folder
    return res.render('postform')
})


app.listen(3000, () => {
    console.log("Server is running in port 3000...")
})