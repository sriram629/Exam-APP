const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

function ConnectToDatabase() {
  const db = process.env.MONGO_URI
  mongoose
    .connect(db)
    .then(() => {
      console.log("Connected to MongoDB")
    })
    .catch((err) => {
      console.error(err)
    })
}

module.exports = ConnectToDatabase
