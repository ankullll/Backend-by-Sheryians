const mongoose = require('mongoose')

const dns = require('node:dns')

dns.setServers(['0.0.0.0','8.8.8.8'])

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Successfully connected yo DB")
    } catch (error) {
        console.log("Database connection failed",error)
    }
}

module.exports = connectDB;