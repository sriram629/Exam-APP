const app = require("../init/init");

const PORT = process.env.RESULT_PORT || 9003;

const ConnectToDatabase = require("../shared/admin/admin");

app.use("/api/results", require("./routes/results.routes.js"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

ConnectToDatabase();

app.listen(PORT, () => {
  console.log(`Results Service is running on port ${PORT}`);
});
