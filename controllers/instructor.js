const Instructor = require("../models/instructor");

// Get all instructors
const getInstructors = async () => {
  const instructors = await Instructor.find();
  return instructors;
};

// Get instructor by ID
const getInstructor = async (_id) => {
  const instructor = await Instructor.findById(_id);
  return instructor;
};

// Add a new instructor
const addNewInstructor = async (
  name,
  qualification,
  profile,
  coursesTaught
) => {
  const newInstructor = new Instructor({
    name,
    qualification,
    profile,
    coursesTaught,
  });
  await newInstructor.save();
  return newInstructor;
};

// Update an instructor
const updateInstructor = async (
  _id,
  name,
  qualification,
  profile,
  coursesTaught
) => {
  const updatedInstructor = await Instructor.findByIdAndUpdate(
    _id,
    {
      name,
      qualification,
      profile,
      coursesTaught,
    },
    {
      new: true,
    }
  );
  return updatedInstructor;
};

// Delete an instructor
const deleteInstructor = async (_id) => {
  return await Instructor.findByIdAndDelete(_id);
};

module.exports = {
  getInstructors,
  getInstructor,
  addNewInstructor,
  updateInstructor,
  deleteInstructor,
};
