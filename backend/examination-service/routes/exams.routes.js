const router = require("express").Router()

const Exam = require("../../shared/models/exam.model")
const Result = require("../../shared/models/results.model")
const authenticate = require("../../shared/middleware/authenticate")

router.route("/latest").get(async (req, res) => {
  try {
    const endDate = new Date()
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - 2)

    const exams = await Exam.find({
      createdAt: { $gte: startDate, $lt: endDate },
    })
      .select("-questions")
      .sort({ createdAt: -1 })

    if (exams.length === 0) {
      return res.status(404).json({ msg: "No latest exams" })
    }

    res.status(200).json(exams)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/all").get(async (req, res) => {
  try {
    const exams = await Exam.find().select("-questions")
    if (!exams.length) {
      return res.status(400).json({
        msg: "No Exam found.",
      })
    }
    res.status(200).json({ exams })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})
router.route("/:id").get(async (req, res) => {
  try {
    const { id } = req.params
    if (!require("mongoose").Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." })
    }
    const exam = await Exam.find({ _id: id })

    if (!exam) {
      return res.status(400).json({
        msg: "No Exam found.",
      })
    }
    const originalExam = exam[0]
    const modifiedExam = {
      title: originalExam.title,
      description: originalExam.description,
      _id: originalExam._id,
      topic: originalExam.topic,
      duration: originalExam.duration,
      questions: originalExam.questions.map((ques) => ({
        question: ques.question,
        options: ques.options,
      })),
    }
    res.status(200).json([modifiedExam])
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/create").post(async (req, res) => {
  try {
    const { title, description, topic, duration, questions } = req.body
    const newExam = new Exam({
      title,
      duration,
      description,
      topic,
      questions,
    })
    const savedExam = await newExam.save()
    res.status(201).json({ msg: "Exam creation successful!" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/delete/all").delete(async (req, res) => {
  try {
    const deletedExams = await Exam.deleteMany({})
    if (deletedExams.deletedCount === 0) {
      return res.status(400).json({
        msg: "No exams found to delete.",
      })
    }
    res.status(200).json({ msg: "All exams deleted successfully!" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/delete/:examId").delete(async (req, res) => {
  try {
    const { examId } = req.params
    if (!require("mongoose").Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ message: "Invalid ID format." })
    }
    const exam = await Exam.findById({ _id: examId })
    if (!exam) {
      return res.status(400).json({
        msg: "No Exam found.",
      })
    }
    const deletedExam = await Exam.findByIdAndDelete({ _id: examId })
    res.status(200).json({ msg: "Exam deletion successful!" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/topic/:topic").get(async (req, res) => {
  try {
    const { topic } = req.params
    const exams = await Exam.find({ topic: topic }).select("-questions")
    if (!exams) {
      return res.status(400).json({
        msg: "No Exam found.",
      })
    }
    res.status(200).json({ exams })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/topics/all").get(async (req, res) => {
  try {
    const uniqueTopics = await Exam.distinct("topic")
    res.status(200).json({ topics: uniqueTopics })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})
router.route("/submit").post(async (req, res) => {
  try {
    const currentTime = Date.now()
    const { studentId, examId, questions } = req.body
    let answers = await Exam.findById({ _id: examId })
    const topic = answers.topic
    const title = answers.title
    if (!answers) {
      return res.status(401).send("No Exam found")
    }
    answers = answers.questions
    let marks = 0
    let totalMarks = questions.length
    for (i = 0; i < totalMarks; i++) {
      if (questions[i].answer === answers[i].answer) {
        marks++
      }
    }
    let noOfWrongAnswers = totalMarks - marks
    const savedResult = await Result.create({
      studentId: studentId,
      examId: examId,
      topic: topic,
      title: title,
      noOfWrongAnswers: noOfWrongAnswers,
      noOfCorrectAnswers: marks,
      totalMarks: totalMarks,
      submissionTime: currentTime,
    })
    return res.status(200).json({ msg: "submitted successfully" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})
module.exports = router
