const express = require('express')
const app = express();
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

//For swagger documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//import all routes here
const home = require('./routes/home')
const user = require('./routes/user')
const product = require('./routes/product')
const payment = require('./routes/payment')

//morgan middleware
app.use(morgan('tiny'))

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies and file middlewares
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

//temp check
app.set('view engine', 'ejs');

//router middlewares
app.use('/api/v1', home);
app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', payment);

app.get('/api/v1/signuptest', (req, res) => {
    res.render("signuptest")
});

module.exports = app;