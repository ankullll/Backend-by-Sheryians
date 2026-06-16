require("dotenv").config();
const app = require("./src/app");
const generateResponse = require("./src/service/ai.service");
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors:{
    origin:"http://localhost:5173"
  }
});

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("A user connected ");

  socket.on("disconnect", () => {
   
  });

  socket.on("message", (data) => {
    console.log("Message received : ", data);
  });

  socket.on("ai-message", async (data) => {
    try {
      console.log(data);
      chatHistory.push({
      role: "user",
      parts: [{ text: data}],
    });
    const response = await generateResponse(chatHistory);
    socket.emit("ai-message-response", response);
    console.log(response)
    chatHistory.push({
      role: "model",
      parts: [{ text: response }],
    });
    } catch (error) {
      console.log("Gemini is over loaded")
    }
  });
});

httpServer.listen(3000, () => {
  console.log("Server chalu on 3000");
});
