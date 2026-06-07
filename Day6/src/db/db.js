const mongoose = require('mongoose')
const dns = require('node:dns');

dns.setServers(['8.8.8.8','1.1.1.1']);

function connectToDB(){
    mongoose.connect('mongodb+srv://ankul:WjIk4A0hQ7zX6vaD@cohort.9rdqfwl.mongodb.net/cohort')
    .then(()=>{
        console.log("DB Connected Successfully")
    })
    .catch((err)=>{
        console.log(err)
    })
}

module.exports = connectToDB