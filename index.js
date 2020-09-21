const express = require("express");
var bodyParser = require("body-parser");

const routes = require("./routes");

const app = express();
const port = 4000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(bodyParser.json());

app.get("/ping", (req, res) => {
  res.send("Hallo!");
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
