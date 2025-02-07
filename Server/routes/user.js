const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  signuppost,
  loginpost,
  getUserData,
} = require("../controllers/userController");
const authenticateUser = require("../middlewares/user");

router.post("/signup", upload.single("profileImage"), signuppost);
router.post("/login", loginpost);

router.get("/getUserData", authenticateUser, getUserData);

module.exports = router;
