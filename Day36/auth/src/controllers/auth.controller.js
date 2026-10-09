const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function registerUser(req, res) {
  try{
    console.log("REGISTER CONTROLLER REACHED");
    const {
    username,
    email,
    password,
    fullName: { firstName, lastName },
  } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [
      { username },
      { email },
      // is query se hm user find kr skte hai agar email se ya fir username se ya fir dono se h
    ],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({ message: "Username or email already exists" });
  }

const hash = await bcrypt.hash(password,10)
  const user = await userModel.create({
    username,
    email,
    password:hash,
    fullName:{firstName,lastName}
  })

  const token = jwt.sign({
    id:user._id,
    username:user.username,
    email:user.email,
    role:user.role
  },process.env.JWT_SECRET,{expiresIn:'1d'})

  res.cookie('token',token,{
    httpOnly:true,
    secure:true,
    maxAge : 24*60*60*1000
  })

  res.status(201).json({
    message:"User registered Successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email,
        fullName:user.fullName,
        role:user.role,
        addresses:user.addresses
    }
  })}
  catch (error) {
  console.error("\n========== REGISTER ERROR ==========");
  console.error(error);
  console.error(error.stack);
  console.error("====================================\n");

  return res.status(500).json({
    message: error.message,
  });
}
}
module.exports = {
  registerUser,
};
