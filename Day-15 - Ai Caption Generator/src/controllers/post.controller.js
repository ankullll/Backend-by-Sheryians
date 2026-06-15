const postModel = require('../models/post.model')
const generateCaption = require('../service/ai.service')
const uploadFile = require('../service/storage.service')
const {v4:uuidv4} = require('uuid')


async function postController(req,res){
    const file = req.file;

    console.log("File recieved : ", file)

    const base64ImageFile =  new Buffer.from(file.buffer).toString('base64');     
    
    const Caption = await generateCaption(base64ImageFile)

    const result = await uploadFile(file.buffer,`${uuidv4()}`)

    const post = await postModel.create({
        caption:Caption,
        image:result.url,
        user:req.user._id
    })

    res.status(200).json({
        message:"Post created successfully",
        post
    })
}

module.exports = postController