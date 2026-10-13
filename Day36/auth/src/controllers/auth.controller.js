const { default: mongoose } = require("mongoose");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../db/redis");

async function registerUser(req, res) {
  try {
    const {
      username,
      email,
      password,
      role,
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
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hash,
      role,
      fullName: { firstName, lastName },
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered Successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await userModel
      .findOne({
        $or: [{ username }, { email }],
      })
      .select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("Error in login user", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
async function getCurrentUser(req, res) {
  return res
    .status(200)
    .json({ message: "current user fetched successfully", user: req.user });
}

async function logoutUser(req, res) {
  const token = req.cookies.token;

  if (token) {
    await redis.set(`blacklist:${token}`, "true", "EX", 24 * 60 * 60);
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({ message: "User logged out successfully" });
}

async function getUserAddresses(req, res) {
  const id = req.user.id;

  const user = await userModel.findById(id).select("addresses");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    message: "user addresses fetched successfully",
    addresses: user.addresses,
  });
}

async function addUserAddress(req, res) {
  const id = req.user.id;

  const { street, city, state, pincode, country, isDefault } = req.body;

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        addresses: {
          street,
          city,
          state,
          pincode,
          country,
          isDefault,
        },
      },
    },
    { new: true },
  );

  if(!user){
    return res.status(404).json({
      message:"User not found"
    })
  }

  return res.status(201).json({
    message:"Addresses updated successfully",
    address:user.addresses[user.addresses.length - 1]
  })
}


async function deleteUserAddress(req,res) {
  const id = req.user.id;

  const {addressId} = req.params;

  const isAddressExists = await userModel.findOne({_id:id,"addresses._id":addressId})
  if(!isAddressExists){
    return res.status(404).json({
      message:"Adress not found"
    })
  }
  const user = await userModel.findOneAndUpdate({_id:id},{
    $pull:{
      addresses:{_id:addressId}
    }
  },{new:true})

  if(!user){
    return res.status(404).json({message:"User not found"})
  }

  const addressExists = user.addresses.some(addr=>addr._id.toString() === addressId);

  if(addressExists){
    return res.status(500).json({message:"Failed to delete address"})
  }


  return res.status(200).json({
    message:"Address deleted successfully",
    addresses:user.addresses
  })
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getUserAddresses,
  addUserAddress,
  deleteUserAddress
};
