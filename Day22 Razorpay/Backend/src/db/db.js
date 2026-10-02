const mongoose = require("mongoose");
const dns = require('node:dns')
dns.setServers(["8.8.8.8","1.1.1.1"])


async function connectDB() {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to db")
}

module.exports = connectDB