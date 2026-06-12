const mongoose = require('mongoose');


function connectToDB(){
    mongoose.connect(process.env.Mongo_url)
    .then(()=>{
        console.log("Connected to DB")
    })
}

module.exports = connectToDB