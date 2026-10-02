const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(morgan("dev"))
app.set("view engine","ejs");

app.post('/api/auth/register',(req,res)=>{
    res.send("Resgister endpoint")
})

app.get('/',(req,res)=>{
    res.render("index",{messages:[`<h1>Namaste mere dost</h1>`,`<h1>Namaste mere dost 2</h1>`]})
})

module.exports=app