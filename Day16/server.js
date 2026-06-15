require('dotenv').config()
const app = require('./src/app')
const generateResponse = require('./src/service/ai.service')
const {createServer} = require("http");
const {Server} = require("socket.io");

const httpServer = createServer(app);

const io = new Server(httpServer,{})

io.on("connection",(socket)=>{
  console.log("A user connected ")

  socket.on("disconnect",()=>{
    console.log("A user disconnected")
  })

  socket.on("message",(data)=>{
    console.log("Message received : ",data)
  })

    socket.on("ai-message",async (data)=>{
      console.log(`${data.prompt}`)
      const response = await generateResponse(data.prompt);
      console.log("Ai response : ",response)
      socket.emit("ai-message-response",{response})
  })
})

httpServer.listen(3000,()=>{
  console.log("Server chalu on 3000")
})
