const express = require("express");
const userModel = require("../models/auth.model");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.create({
    username,
    password,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );
           
  res.cookie("token",token)

  res.status(201).json({
    message: "user registered successfully",
    user: user,
    
  });
});

// Login api

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username: username });

  if (!user) {
    return res.status(401).json({
      message: "Invalid username!",
    });
  }

  const validPassword = password === user.password;

  if (!validPassword) {
    return res.status(401).json({
      message: "Incorrect password !",

    });
  }
  res.status(200).json({
    message: "user logged in successfully",
  });
});
//  get userdata api

router.get("/user", async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({
        _id:decoded.id
    }).select("-__v -password ")
    res.status(200).json({
        message:"User data fetched successfully",
        user
    })
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized - invalid token",
    });
  }
});

module.exports = router;
