const mongoose = require("mongoose")

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    examId: {
      type: String,
      required: true,
      trim: true,
    },
    totalMarks: {
      type: Number,
      required: true,
      trim: true,
    },
    noOfCorrectAnswers: {
      type: Number,
      required: true,
      trim: true,
    },
    noOfWrongAnswers: {
      type: Number,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    submissionTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const Result = mongoose.model("Result", resultSchema)

module.exports = Result
