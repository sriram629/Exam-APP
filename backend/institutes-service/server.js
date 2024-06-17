const app = require("../init/init.js");

const PORT = process.env.INSTITUTES_PORT || 9004;

const ConnectToDatabase = require("../shared/admin/admin.js");

app.use("/api/institutes", require("./routes/institutes.routes.js"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

ConnectToDatabase();

app.listen(PORT, () => {
  console.log(`Results Service is running on port ${PORT}`);
});
