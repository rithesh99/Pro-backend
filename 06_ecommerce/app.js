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

//morgan middleware
app.use(morgan('tiny'))

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cookies and file middlewares
app.use(cookieParser());
app.use(fileUpload())

//router middlewares
app.use('/api/v1',home);

module.exports = app;