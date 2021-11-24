const express = require('express');
const router = express.Router()

const { signup, login, logout, forgotPassword, resetPassword,
    getLoggedInUserDetails, changePassword, updateUserDetails,
    adminAllUser } = require('../controllers/userController')

const { isLoggedIn, customRole } = require("../middlewares/user")

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotpassword').post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/userdashboard').get(isLoggedIn, getLoggedInUserDetails)
router.route('/password/update').post(isLoggedIn, changePassword)
router.route('/userdashboard/update').post(isLoggedIn, updateUserDetails)

router.route('/admin/users').get(isLoggedIn, customRole('admin'), adminAllUser)

module.exports = router