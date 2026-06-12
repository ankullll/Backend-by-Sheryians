const express = require('express');
const userModel = require('../models/auth.model')
const router = express.Router();

router.post('/register', async(req,res)=>{
    const {username,password}  = req.body;

    const user = await userModel.create({
        username,password 
    })

    res.status(201).json({
        message:"user registered successfully",
        user :user
    })
})


// Login api

router.post('/login', async (req,res)=>{
 
    const {username,password} = req.body;

    const user = await  userModel.findOne(
      {  username:username}
    )

    if(!user){
        return res.status(401).json({
            message : "Invalid username!"
        })
    }

    const validPassword = password === user.password

    if(!validPassword){
        return res.status(401).json({
            message:"Incorrect password !"
        })

    }
    res.status(200).json({
        message:"user logged in successfully"
    })

})



module.exports = router