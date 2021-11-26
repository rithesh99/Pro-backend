const express = require('express');
const router = express.Router()
const { isLoggedIn, customRole } = require("../middlewares/user")

const { addProduct } = require('../controllers/productController')

router.route('/product/add').post(isLoggedIn, customRole("admin"), addProduct)

module.exports = router