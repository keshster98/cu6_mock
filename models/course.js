// Import mongoose
const mongoose = require("mongoose");
// Create schema for course
const { Schema, model } = mongoose;

/*
    Instruction: Setup the course schema according to the following requirements:

    - `title`: (String, required)
    - `instructor`: (ObjectId, ref: 'Instructor', required)
    - `startDate`: (Date)
    - `endDate`: (Date)
    - `subject`: (String)
    - `description`: (String)
    - `enrollmentCount`: (Number, default: 0) - The number of students enrolled
*/

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  subject: {
    type: String,
  },
  description: {
    type: String,
  },
  enrolmentCount: {
    type: Number,
    default: 0,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "Instructor",
  },
});

// Converting the schema into a model
const Course = model("Course", courseSchema);

// Exporting the model
module.exports = Course;
