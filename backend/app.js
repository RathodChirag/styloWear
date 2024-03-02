const express = require("express");
const mongoose = require("mongoose");
const app = express();
const adminRouter = require('./routes/adminRoute');

// Middleware to parse JSON bodies
app.use(express.json());

//Connect to the database
mongoose
  .connect("mongodb://0.0.0.0:27017/styloWear")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.log("error while connection to the database", error);
  });

// app.get("/", (req, res) => {
//   res.send("Home page");
// });

//Route for the admin controller
app.use('/admin', adminRouter);

// app listining on port
app.listen(3000, (req, res) => {
  console.log("server is running on port 3000");
});
