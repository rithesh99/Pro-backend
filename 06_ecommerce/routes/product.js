const express = require('express');
const router = express.Router()
const { isLoggedIn, customRole } = require("../middlewares/user")

const { addProduct, getAllProducts, adminGetAllProducts,
    getOneProduct, adminUpdateONeProduct, adminDeleteOneProduct } = require('../controllers/productController')

//user routes
router.route('/products').get(getAllProducts)
router.route('/product/:id').get(getOneProduct)

//admin routes  
router.route('/admin/product/add').post(isLoggedIn, customRole("admin"), addProduct)
router.route('/admin/products').get(isLoggedIn, customRole("admin"), adminGetAllProducts)
router.route('/admin/products/:id')
    .put(isLoggedIn, customRole("admin"), adminUpdateONeProduct)
    .delete(isLoggedIn, customRole("admin"), adminDeleteOneProduct)

module.exports = router