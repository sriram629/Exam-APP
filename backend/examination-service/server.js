const app = require("../init/init");

const PORT = process.env.EXAMINATION_PORT || 9002;

const ConnectToDatabase = require("../shared/admin/admin");

app.use("/api/exams", require("./routes/exams.routes.js"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

ConnectToDatabase();

app.listen(PORT, (req, res) => {
  console.log("Examination Service is running on port 9002");
});
