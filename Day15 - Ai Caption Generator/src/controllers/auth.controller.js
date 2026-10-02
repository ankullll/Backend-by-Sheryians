const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


async function registerController(req,res){

    const {username,password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({username})

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"Username already exists"
        })
    }

    const user = await userModel.create({
        username,password:await bcrypt.hash(password,10)
    })

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(201).json({
        message:"User registered successfully"
    })

}


async function loginController(req,res){
    const {username,password} = req.body;

    const user = await userModel.findOne({username})

    if(!user){
        return res.status(400).json({
            message:"User not find ,"
        })
    }

    const validPassword = await bcrypt.compare(password,user.password)

    if(!validPassword){
        return res.status(409).json({
            message:"Invalid password"
        })
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

    res.cookie("token",token);

    res.status(200).json({
        message:"User logged in successfully"
    })

}

module.exports = {registerController,loginController}