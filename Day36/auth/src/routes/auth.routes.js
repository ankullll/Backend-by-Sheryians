const express = require('express')
const validator = require('../middlewares/validator.middleware')
const authController = require('../controllers/auth.controller')
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router()

router.post('/register',validator.registerUserValidations,authController.registerUser)
router.post('/login',validator.loginUserValidations,authController.loginUser)
router.get('/me',authMiddleware.authMiddleware,authController.getCurrentUser)
router.get('/logout',authController.logoutUser)
module.exports = router