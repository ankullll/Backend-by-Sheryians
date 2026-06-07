const express = require('express');

const router = express.Router();

router.use((req,res,next)=>{
    console.log("im working between router and api")
    next()
})

router.get('/',(req,res)=>{
    res.json({
        message:"Welcome to the first API" , 
    })
})


module.exports = router