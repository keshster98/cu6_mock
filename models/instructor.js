// Import mongoose
const mongoose = require("mongoose");
// Create schema for instructor
const { Schema, model } = mongoose;

/*
    Instruction: Setup the instructor schema according to the following requirements:

    - `name`: (String, required)
    - `qualification`: (String) - Academic and professional qualifications
    - `profile`: (String) - A brief description or biography of the instructor
    - `coursesTaught`: (Number, default: 0) - A count of the number of courses taught
*/

const instructorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
  },
  profile: {
    type: String,
  },
  coursesTaught: {
    type: Number,
    default: 0,
  },
});

// Converting the schema into a model
const Instructor = model("Instructor", instructorSchema);

// Exporting the model
module.exports = Instructor;
