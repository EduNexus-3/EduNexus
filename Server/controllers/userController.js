const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});
// function to handle file upload on cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) reject(error);
        resolve(result.secure_url);
      })
      .end(file.buffer);
  });
};
// function to handle signup request
module.exports.signuppost = async (req, res) => {
  const { username, email, password } = req.body;

  // Checking if the entries are valid or not
  if (!username || !email || !password) {
    res.status(400).json({ message: "Please Enter All The Fields" });
    return;
  }
  try {
    const profileImage = req.file;
    const profileImageUrl = "";
    if (profileImage) {
      profileImageUrl = await uploadToCloudinary(profileImage);
    }

    // creating the hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await User.findOne({ email });

    // if the we found a user with existing email
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exist" });
      return;
    }

    // creating new user
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
      profileImage: profileImageUrl,
    });
    await user.save();

    // creating the token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: "user",
      },
      process.env.USER_JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // signup successful message
    res.status(200).json({
      message: "SignUP succesfull",
      token: token,
    });
  } catch (err) {
    console.log(err);
  }
};

// function to handle login req
module.exports.loginpost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Invalid username or password" });
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(404).json({ message: "Invalid username or password" });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: "user",
      },
      process.env.USER_JWT_SECRET,
      {
        expiresIn: "24H",
      }
    );
    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getUserData = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: "user",
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Authorisarion failed",
    });
  }
};
