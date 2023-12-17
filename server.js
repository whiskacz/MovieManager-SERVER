const loginData = require("./loginData");
const express = require("express");
const mongoose = require("mongoose")
const Router = require('./routes/routes')
const cors = require("cors")
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

mongoose.connect(`${loginData}`,)

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("Connected successfully");
  });

app.use(Router)

app.listen(port, function(){
    console.log(`express is running on port ${port}`)
})
