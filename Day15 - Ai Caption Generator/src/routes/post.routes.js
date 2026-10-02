const express = require('express')
const postController = require('../controllers/post.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const multer = require('multer');

const upload = multer({storage:multer.memoryStorage()})

const router = express.Router();


router.post('/',authMiddleware,upload.single("image"), postController)

module.exports = router