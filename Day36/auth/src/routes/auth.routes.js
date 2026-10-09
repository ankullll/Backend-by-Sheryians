const express = require('express')
const validator = require('../middlewares/validator.middleware')
const authController = require('../controllers/auth.controller')
const router = express.Router()

router.post('/register',validator.registerUserValidations,authController.registerUser)

module.exports = router