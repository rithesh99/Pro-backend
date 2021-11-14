const mongoose = require('mongoose');

const { MONGODB_URL } = process.env;

exports.connect = () => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(res => {
        // console.log(res);
        console.log('DB CONNECTTED SUCCESSFULLY');
    })
    .catch(error => {
        console.log(error);
        console.log("DB CONNECTION FAILED");
        process.exit(1);
    })
}