const Course = require("../models/course");

// Get all courses
const getCourses = async () => {
  const courses = await Course.find().populate("instructor");
  return courses;
};

// Get a course by ID
const getCourse = async (_id) => {
  const course = await Course.findById(_id).populate("instructor");
  return course;
};

// Add a new course
const addNewCourse = async (
  title,
  instructor,
  startDate,
  endDate,
  subject,
  description,
  enrolmentCount
) => {
  const newCourse = new Course({
    title,
    instructor,
    startDate,
    endDate,
    subject,
    description,
    enrolmentCount,
  });
  await newCourse.save();
  return newCourse;
};

// Update a course
const updateCourse = async (
  _id,
  title,
  instructor,
  startDate,
  endDate,
  subject,
  description,
  enrolmentCount
) => {
  const updatedCourse = await Course.findByIdAndUpdate(
    _id,
    {
      title,
      instructor,
      startDate,
      endDate,
      subject,
      description,
      enrolmentCount,
    },
    {
      new: true,
    }
  );
  return updatedCourse;
};

// Delete a course
const deleteCourse = async (_id) => {
  return await Course.findByIdAndDelete(_id);
};

module.exports = {
  getCourses,
  getCourse,
  addNewCourse,
  updateCourse,
  deleteCourse,
};
