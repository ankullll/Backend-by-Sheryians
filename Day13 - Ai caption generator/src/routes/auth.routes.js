const express = require('express');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const router = express.Router()

router.post('/register',async(req,res)=>{
    const {username,password} = req.body

    const isUserExist = await userModel.findOne({
        username
    })

    if(isUserExist){
        return res.status(409).json({
            message:"Username already exists"
        })
    }

    const user = await userModel.create({
        username,password
    })
     
    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

    res.cookie("token",token)


    res.status(201).json({
        message:"User regiestered successfully",
        user
    })
})

module.exports = router