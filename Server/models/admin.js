const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    subscribedInstructor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Instructor",
      },
    ],
  },
  { timestamps: true }
);

const Admin = mongoose.model("admin", adminSchema);

module.exports = adminSchema;
