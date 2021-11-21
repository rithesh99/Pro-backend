const mongoose = require('mongoose')

const connectWithDB = () => {
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('DB GOT CONNECTED')
    })
    .catch(err => {
        console.log("*********DB FAILED***********")
        console.log(err)
        process.exit(1)
    })
}

module.exports = connectWithDB