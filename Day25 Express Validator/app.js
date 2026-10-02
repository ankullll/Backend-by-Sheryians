const express = require('express')
const validationRules = require('./middlewares/validator.middleware')
const app = express()
app.use(express.json())

app.post('/submit',validationRules,(req,res)=>{
    const {username,email,password} = req.body;


    res.status(201).json({
        message:"User registered Successfully",
        username,email,password
    })
})

app.listen(3000,()=>{
    console.log("Server is running on 3000")
})