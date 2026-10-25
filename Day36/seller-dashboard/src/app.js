const express = require("express");
const sellerroutes = require("./routes/seller.routes")
const app = express()
app.use(express.json())
app.use("/api/seller/dashboard",sellerroutes)

app.get("/",(req,res)=>{
     res.status(200).json({message:"Seller dashboard service is running"})
})


module.exports = app