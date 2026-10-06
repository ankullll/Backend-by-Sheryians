const express = require('express')

const app = express()

app.get('/contact',(req,res)=>{
    for(let i = 0;i<1000000000;i++){
        res.send("Contact us")
    }
})

app.listen(3002,()=>{
    console.log("Running on 3002")
})