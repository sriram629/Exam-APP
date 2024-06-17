const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

require("../shared/config/config");

const app = express();

const corsOptions = {
  origin: `${process.env.FRONDEND_LINK}`,
  credentials: true,
  optionSuccessStatus: 200,
  Headers: true,
  exposedHeaders: "Set-Cookie",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Content-Type",
    "Authorization",
  ],
};
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

module.exports = app;
