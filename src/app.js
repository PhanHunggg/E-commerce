require("dotenv").config();
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const routes = require("./routes/index");
const app = express();

// init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// init db
require("./dbs/init.mongodb");
//init routes
app.use("/", routes);

//handling errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;

  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
