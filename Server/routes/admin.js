const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middlewares/admin.js");
const signuppost = require("../controllers/adminController");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", upload.single("profileImage"), signuppost);

module.exports = router;
