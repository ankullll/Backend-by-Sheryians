const mongoose = require('mongoose');


function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("Connected to DB");
    })
}


module.exports = connectDB