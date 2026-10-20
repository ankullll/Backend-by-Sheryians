require("dotenv").config()
const sendEmail = require("./src/email")


sendEmail("ankulsingh975@gmail.com","Supernova Notification","Test","<b>This notification service is working</b>")