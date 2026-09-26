const express = require("express");

const app = express();
const rateLimit = require("express-rate-limit");

app.use(express.json());

const limiter = rateLimit({
  window: 1 * 60 * 1000,
  max: 5,
  message: "Too many request from this IP , try again after some time",
});

// app.use(limiter)  isko pure server pe bhi apply kar skte h

app.post("/api/auth/register", limiter, (req, res) => {
  res.status(201).json({ message: "User registered successfully" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 ");
});
