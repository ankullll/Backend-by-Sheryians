const mongoose = require("mongoose")
const dns = require("node:dns")
dns.setServers(["0.0.0.0","8.8.8.8"])

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to Seller DB")
    } catch (error) {
        console.log("Error connecting to seller DB:",error)
    }
}

module.exports = connectDB