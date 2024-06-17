const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    institute: {
      type: String,
      required: true,
      trim: true,
    },
    verificationCode: {
      type: String,
      default: "",
      trim: true,
    },
    verificationCodeExpires: {
      type: Date,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Student = mongoose.model("Student", studentSchema)

module.exports = Student
