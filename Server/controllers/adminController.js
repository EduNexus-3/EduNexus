const Admin = require("../models/admin.js");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "doubts",
  });
});

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

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

// Function to handle signup request
module.exports.signuppost = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  try {
    const profileImage = req.file;

    const profileImageUrl = await uploadToCloudinary(profileImage);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        message: "User with this eamil alread exists!",
      });
      return;
    }

    // creating new admin
    const admin = new Admin({
      username: username,
      email: email,
      password: hashedPassword,
      profileImage: profileImageUrl,
    });

    await admin.save();

    return res.status(200).json({
      message: "Registered successfull! Approval pending",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// function to handle login of admin
module.exports.loginpost = async (req, res) => {
  try {
    const { email, password } = req.body;
    // checking if the admin with this email exist or not
    const admin = await Admin.findOne({ email: email });

    const validPassword = await bcrypt.compare(password, admin.password);
    // if no admin found
    if (!admin) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }
    // if passwords doesn't match
    if (!validPassword) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }

    // if admin is not approved
    if (!admin.isApproved) {
      return res.status(400).json({
        message: "Approval Pending",
      });
    }

    // signing the admin
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: "admin",
      },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "24h" }
    );

    //login succesfull
    return res.status(200).json({
      message: "Login successfull",
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.getAdminData = async (req, res) => {
  try {
    const id = req.user.id;

    //fetching admin from database
    const admin = await Admin.findById(id);

    return res.status(200).json({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: "admin",
      profileImage: admin.profileImage,
    });
  } catch (err) {
    res.status(404).json({
      message: "Authorization failed",
    });
  }
};
