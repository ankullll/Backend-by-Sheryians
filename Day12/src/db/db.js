const mongoose = require('mongoose');


function connectToDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Connected to successfully ")
    })
}

module.exports = connectToDB