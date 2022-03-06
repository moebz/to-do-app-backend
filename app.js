require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
  res.send("Hallo!");
});

app.use("/api", routes);

// Error handler.
// DO NOT remove 'next' parameter.
app.use((error, req, res, next) => {
  res.status(500);
  res.json({
    message: error.message,
  });
});

module.exports = app;
