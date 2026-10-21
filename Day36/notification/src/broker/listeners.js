const {subscribeToQueue} = require("./broker")
const sendEmail = require("../email")
module.exports = function (){
    subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED",async(data)=>{
    
        const emailHTMLTemplate = `
        <h1>Welcome To Our Service </h1>
        <p>Dear ${data.fullName.firstName + "" + (data.fullName.lastName || "")},</p>
        <p>Thank you for regestring with us. We are excited to have you on board! </p>
        <p>Best regards, <br/> The Team</p>
        ` 

        sendEmail(data.email,"Welcome To Our Service","Thank you for registering with us!",emailHTMLTemplate)
        
})
}