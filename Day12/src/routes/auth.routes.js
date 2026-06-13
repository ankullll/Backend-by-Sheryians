  const express = require("express");
const userModel = require("../models/user.model");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({
    username,
  });
  if (user) {
    return res.status(409).json({
      message: "Username already exists,",
    });
  }

  const newUser = await userModel.create({
    username,
    password,
  });

  const token = jwt.sign(
    {
      id: newUser._id,
      username,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);
  res.status(201).json({
    message: "User registered successfully",
    user: newUser
  });
});

router.get("/user", async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ 
      message: "Unauthorized! token not found",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({
      _id: decoded.id,
    });

    res.status(200).json({
        message:"User data fetched successfully",
        user
    })


  } catch (error) {
    res.status(401).json({
        message:"Invalid token"

    }) 
  } 
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const isPasswordValid = user.password === password;
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password"
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username
        },
        process.env.JWT_SECRET
    );

    res.cookie("token", token,{
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    });
    res.status(200).json({
        message: "Login successful",
        user
    });
});

router.get('/logout', (req,res)=>{
    res.clearCookie("token")

    res.status(200).json({
        message:"user logged out successfully"
    })
})

module.exports = router;
