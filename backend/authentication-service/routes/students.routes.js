const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SibApiV3Sdk = require("sib-api-v3-sdk")
const fs = require("fs")

const Student = require("../../shared/models/student.model")
const authenticate = require("../../shared/middleware/authenticate")

router.route("/").get(authenticate, async (req, res) => {
  const student = await Student.findById(req.student.id).select("-password")
  res.json(student)
})

router.route("/signup").post(async (req, res) => {
  try {
    const { username, email, password, institute } = req.body

    const existingStudent = await Student.findOne({ email: email })

    if (existingStudent) {
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." })
    }

    const existingStudentUsername = await Student.findOne({
      username: username,
    })

    if (existingStudentUsername) {
      return res
        .status(400)
        .json({ msg: "An account with this username already exists." })
    }

    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    const newStudent = new Student({
      username,
      email,
      password: passwordHash,
      institute,
      verificationCode: "",
      verificationCodeExpires: null,
    })

    const savedStudent = await newStudent.save()
    res.status(201).json({ msg: "Registration successful!" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/login").post(async (req, res) => {
  try {
    const { identifier, password } = req.body

    const student = await Student.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })

    if (!student.active) {
      return res.status(400).json({ msg: "Account not activated." })
    }

    if (!student) {
      return res.status(400).json({
        msg: "No account with this email or username has been registered.",
      })
    }

    const isMatch = await bcrypt.compare(password, student.password)

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." })
    }

    const payload = {
      student: {
        id: student.id,
      },
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    })
    const cookieParams = { httpOnly: true, sameSite: "none", secure: true }

    res
      .cookie("token", token, cookieParams, cookieParams, {
        expires: new Date(Date.now() + 25892000000),
      })
      .send({
        msg: "Login successful!",
        user: {
          id: student.id,
          username: student.username,
          email: student.email,
          institute: student.institute,
        },
      })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/logout").get((_, res) => {
  try {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) }).send({
      msg: "Logged out successfully!",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/email-verification").post(async (req, res) => {
  try {
    const { email } = req.body

    const student = await Student.findOne({ email: email })

    if (!student) {
      return res.status(400).json({
        msg: "No account with this email has been registered.",
      })
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000)
    const expires = Date.now() + 5 * 60 * 1000

    const templatePath = "../shared/templates/verification-template.html"
    const emailTemplate = fs.readFileSync(templatePath, "utf-8")

    const formattedEmail = emailTemplate.replace(
      "{{verificationCode}}",
      verificationCode
    )

    const defaultClient = SibApiV3Sdk.ApiClient.instance

    const apiKey = defaultClient.authentications["api-key"]
    apiKey.apiKey = process.env.SIB_API_KEY

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    const message = new SibApiV3Sdk.SendSmtpEmail()

    message.subject = "Verification Code"
    message.htmlContent = formattedEmail
    message.sender = {
      name: "Exam Application",
      email: process.env.EMAIL,
    }
    message.to = [
      {
        email: email,
        name: student.username,
      },
    ]

    apiInstance
      .sendTransacEmail(message)
      .then(async function (data) {
        student.verificationCode = verificationCode
        student.verificationCodeExpires = expires
        await student.save()
        res
          .status(200)
          .json({ msg: "Verification code sent to your email address" })
      })
      .catch(function (error) {
        console.error(error)
        res.status(500).json({ msg: "Something went wrong" })
      })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/otp-verification").post(async (req, res) => {
  try {
    const { verificationCode } = req.body

    const student = await Student.findOne({
      verificationCode: verificationCode,
    })

    if (!student) {
      return res.status(400).json({ msg: "Invalid verification code." })
    }

    if (verificationCode !== student.verificationCode) {
      return res.status(400).json({ msg: "Invalid verification code." })
    }

    const currentDate = new Date()

    const verificationCodeExpires = new Date(student.verificationCodeExpires)

    if (verificationCodeExpires < currentDate) {
      return res.status(400).json({ msg: "Verification code has expired." })
    }

    res.cookie("verificationCode", verificationCode, { httpOnly: true }).send({
      msg: "Verification successful!",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/reset-password").post(async (req, res) => {
  try {
    const { password } = req.body

    const verificationCode = req.cookies.verificationCode

    if (!verificationCode) {
      return res.status(400).json({ msg: "Invalid verification code." })
    }

    const student = await Student.findOne({
      verificationCode: verificationCode,
    })

    if (!student) {
      return res.status(400).json({ msg: "Invalid verification code." })
    }

    const now = Date.now()

    if (now > student.verificationCodeExpires) {
      return res.status(400).json({ msg: "Verification code has expired." })
    }

    const salt = await bcrypt.genSalt()

    const passwordHash = await bcrypt.hash(password, salt)

    student.password = passwordHash

    student.verificationCode = ""

    student.verificationCodeExpires = ""

    await student.save()

    res
      .clearCookie("verificationCode")
      .send({ msg: "Password reset successful!" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/change-password").post(authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    const student = await Student.findById(req.student.id)

    if (!student) {
      return res.status(400).json({ msg: "Student not found." })
    }

    const isMatch = await bcrypt.compare(oldPassword, student.password)

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." })
    }

    const salt = await bcrypt.genSalt()

    const passwordHash = await bcrypt.hash(newPassword, salt)

    student.password = passwordHash

    await student.save()

    res.status(200).json({ msg: "Password changed successfully." })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/update-profile").post(authenticate, async (req, res) => {
  try {
    const { username, email, institute } = req.body

    const student = await Student.findById(req.student.id)

    if (!student) {
      return res.status(400).json({ msg: "Student not found." })
    }

    if (username) {
      if (username === student.username) {
        return res.status(400).json({
          msg: "This is your current username. Please enter a different username.",
        })
      }

      const isUsernamePresent = await Student.findOne({ username: username })

      if (isUsernamePresent) {
        return res.status(400).json({ msg: "Username already taken." })
      }

      student.username = username
    }

    if (email) {
      if (email === student.email) {
        return res.status(400).json({
          msg: "This is your current email address. Please enter a different email address.",
        })
      }

      const isEmailPresent = await Student.findOne({ email: email })

      if (isEmailPresent) {
        return res.status(400).json({ msg: "Email already taken." })
      }

      student.email = email
    }

    if (institute) {
      student.institute = institute
    }

    await student.save()

    res.status(200).json({ msg: "Profile updated successfully." })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/activate-account").post(async (req, res) => {
  try {
    const { email } = req.body

    const student = await Student.findOne({ email: email })

    if (!student) {
      return res.status(400).json({ msg: "Student not found." })
    }

    if (student.active) {
      return res.status(400).json({ msg: "Account already activated." })
    }

    student.active = true

    await student.save()

    res.status(200).json({ msg: "Account activated successfully." })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

router.route("/auth/redirect").get((req, res) => {
  const { token } = req.cookies
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.student = decoded.student
    if (decoded.student.id) {
      res.status(200).json({ msg: "Authenticated successfully." })
    } else {
      res.status(401).json({ msg: "Not authenticated." })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." })
  }
})

module.exports = router
