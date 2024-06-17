const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {
  const cookies = req.cookies
  const token = cookies["token"]

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied." })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.student = decoded.student
    next()
  } catch (e) {
    console.error(e)
    res.status(400).json({ msg: "Token is invalid, authorization denied" })
  }
}

module.exports = authenticate
