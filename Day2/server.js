const express = require('express')

const server = express();

server.get('/home',(req,res)=>{
    res.send("Welcome to home page")
})

server.listen(3000,()=>{
    console.log("Working on port 3000")
})
