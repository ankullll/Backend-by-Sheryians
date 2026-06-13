const postModel = require('../models/post.model')
const generateCaption = require('../service/ai.service')


async function postController(req,res){
    const file = req.file;

    console.log("File recieved : ", file)

    const base64ImageFile =  new Buffer.from(file.buffer).toString('base64');     
    
    const Caption = await generateCaption(base64ImageFile)

    res.status(200).json({
        message:"Caption generated successfully",
        Caption
    })
}

module.exports = postController