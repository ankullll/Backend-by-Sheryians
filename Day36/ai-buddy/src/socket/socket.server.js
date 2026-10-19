
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const agent = require("../agent/agent");
const { AIMessage } = require("@langchain/core/messages");

async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    const token = cookies ? cookie.parse(cookies).token : null;

    if (!token) {
      return next(new Error("Token not found"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded;
      socket.token = token;

      next();
    } catch (error) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user);
    console.log("Token available:", Boolean(socket.token));

    socket.on("message", async (data) => {
      try {
        console.log("Received message:", data);

        const agentResponse = await agent.invoke(
          {
            messages: [
              {
                role: "user",
                content: data,
              },
            ],
          },
          {
            metadata: {
              token: socket.token,
            },
          }
        );

        const lastMessage = agentResponse.messages[agentResponse.messages.length -1]
        socket.emit("message",lastMessage.content)


      } catch (error) {
        console.error("Agent error:", error.message);
        socket.emit("error", {
          message: "Failed to process your message",
        });
      }
    });
  });
}

module.exports = { initSocketServer };
