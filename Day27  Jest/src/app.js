const express = require('express')

const app = express()

app.use(express.json())

app.get('/',(req,res)=>{
    res.status(200).json({message:"Working"})
})

app.post('/api/auth/register',(req,res)=>{
    const{username,email} = req.body;

    res.status(201).json({
        message:"User registered successfully",
        email,username
    })
})

module.exports = app


