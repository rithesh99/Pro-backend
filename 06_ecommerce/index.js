require('dotenv').config();
const app = require('./app');
const connectWithDB = require('./config/db')
const cloudinary = require('cloudinary').v2

//connect with DB
connectWithDB();

//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running at ${process.env.PORT}`)
})