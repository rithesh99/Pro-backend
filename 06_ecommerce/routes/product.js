const express = require('express');
const router = express.Router()
const { isLoggedIn, customRole } = require("../middlewares/user")

const { testproduct } = require('../controllers/productController')

router.route('/testproduct').get(testproduct)

module.exports = router