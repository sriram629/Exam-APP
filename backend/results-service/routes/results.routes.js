const router = require("express").Router()

const Results = require("../../shared/models/results.model")

//Student routes

router.route("/:studentId/all").get(async (req, res) => {
  try {
    let { studentId } = req.params
    const results = await Results.find({ studentId })

    if (!results || results.length === 0) {
      return res.status(404).json({ msg: "No records found." })
    }

    res.status(200).json({ results })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/:studentId/:examId").get(async (req, res) => {
  try {
    const { studentId, examId } = req.params
    const results = await Results.find({ studentId, examId })

    if (!results || results.length === 0) {
      return res.status(404).json({ msg: "No records found." })
    }

    res.status(200).json({ results })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/:studentId/:topic/all").get(async (req, res) => {
  try {
    const { studentId, topic } = req.params
    const results = await Results.find({ studentId, topic })

    if (!results || results.length === 0) {
      return res.status(404).json({ msg: "No records found." })
    }

    res.status(200).json({ results })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

//teacher routes

router.route("/all").get(async (req, res) => {
  try {
    const results = await Results.find({})

    if (!results || results.length === 0) {
      return res.status(404).json({ msg: "No records found." })
    }

    res.status(200).json({ results })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/:topic").get(async (req, res) => {
  try {
    const { topic } = req.params
    const results = await Results.find({ topic: topic })

    if (!results || results.length === 0) {
      return res.status(404).json({ msg: "No records found." })
    }

    res.status(200).json({ results })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

module.exports = router
