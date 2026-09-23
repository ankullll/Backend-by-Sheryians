const mongoose = require("mongoose")

const prodcutSchema = new mongoose.Schema({
    title:String,
    image:String,
    description:String,
    price:{
        amount:{
            type:Number,
            min:0
        },
        currency:{
            type:String,
            default:"INR",
            enum:["INR","USD"],
             
        }
    },
   

})

const prodcutModel = mongoose.model("products",prodcutSchema)

module.exports = prodcutModel;