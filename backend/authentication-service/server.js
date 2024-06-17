const app = require("../init/init");

const ConnectToDatabase = require("../shared/admin/admin");

app.use("/api/student/", require("./routes/students.routes"));

app.get("/", (_, res) => {
  res.send("Hello World!");
});

ConnectToDatabase();

const PORT = process.env.AUTHENTICATION_PORT || 9001;

app.listen(PORT, () => {
  console.log(`Authentication Serice is running on port ${PORT}`);
});
