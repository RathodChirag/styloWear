require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const adminRouter = require('./routes/adminRoute');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const productRatingRouter = require('./routes/productRatingRoute');
const orderRouter = require('./routes/orderRoute');

// Middleware to parse JSON bodies
app.use(express.json());

//Connect to the database
mongoose
  .connect(process.env.DB_HOST)
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
app.use('/user',userRouter);
app.use('/admin/product',productRouter);
app.use('/product',productRatingRouter);
app.use('/order',orderRouter);

// app listining on port
app.listen(3000, (req, res) => {
  console.log("server is running on port 3000");
});
