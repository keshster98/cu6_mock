// Import express
const express = require("express");

// Import mongoose
const mongoose = require("mongoose");

// Import cors
const cors = require("cors");

// Create the express app
const app = express();

// Set a constant port value
const port = 5555; // Changed from "5000" to "5555"

// Middleware to handle JSON request
app.use(express.json());

// Instruction: Setup cors policy
app.use(cors());

// Instruction: Setup MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/cu6")
  .then(() => {
    // If MongoDB is successfully connected
    console.log(
      "MongoDB is successfully connected, database 'cu6' is ready for use."
    );
  })
  .catch((error) => {
    // If there is an error connecting to MongoDB
    console.log(error);
  });

// Root route
app.get("/", (req, res) => {
  res.send("Good luck!");
});

// Start the sever
app.listen(port, () => console.log(`Server started on port ${port}`));

// Instruction: Setup routes
const courseRouter = require("./routes/courses");
const instructorRouter = require("./routes/instructors");

// Applying routes
app.use("/courses", courseRouter);
app.use("/instructors", instructorRouter);
