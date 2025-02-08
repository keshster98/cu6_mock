// Import express
const express = require("express");

// Import mongoose (Nice one Sir, you didn't include this and almost made me forget this)
const mongoose = require("mongoose");

// Create a router for courses
const router = express.Router();

// Instruction: Import the course model
const Course = require("../models/course");

/* 
    Instruction: 
    - setup GET /: List all courses (utilize populate() to bring in instructor details)
*/
router.get("/", async (req, res) => {
  try {
    // Get all courses
    const courses = await Course.find().populate("instructor");
    // Send retrieved courses data to requester
    res.status(200).send(courses);
  } catch (error) {
    // Send error message if any server error in retrieving courses
    res
      .status(400)
      .send({ error: `Error fetching courses: ${error._message}` });
  }
});

// Instruction: Setup GET /:id: Retrieve details of a specific course by its _id (use populate() for instructor details)
router.get("/:id", async (req, res) => {
  try {
    // Retrieve the id from URL parameter
    const _id = req.params.id;

    // Check if it is a valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({
        // If not a valid MongoDB ID, send an error to the requester
        error: `Unrecognised MongoDB ID format: ${_id}!`,
      });
    }

    // If no errors above, get the specific course
    const course = await Course.findById(_id).populate("instructor");

    // If course exists, send the course to the requester
    if (course) {
      res.status(200).send(course);

      // If course does not exist, send an error to the requester
    } else {
      res.status(400).send({ error: `No such course with ID: ${_id} found!` });
    }
  } catch (error) {
    // Send error message if any server error in retrieving the specific course
    res.status(400).send({
      error: `Error fetching course: ${error._message}`,
    });
  }
});

// Instruction: Setup POST /: Add a new course
router.post("/", async (req, res) => {
  try {
    // Retrieve the required data from req.body
    const title = req.body.title;
    const instructor = req.body.instructor;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const subject = req.body.subject;
    const description = req.body.description;
    const enrolmentCount = req.body.enrolmentCount;

    // Check if all 2 required fields are filled up
    if (!title || !instructor) {
      // Sends an error to the requester if conditions are not met
      return res.status(400).send({
        error: `The course's title and it's instructor is required!`,
      });
    }

    // Checks for a duplicate course
    const existingCourse = await Course.findOne({ title, instructor });
    if (existingCourse) {
      // Sends an error to the requester if a duplicate course is found
      return res.status(400).send({
        error: `The course ${title}, taught by ${instructor} has already been added!`,
      });
    }

    // If no errors above, add the new course
    const newCourse = new Course({
      title,
      instructor,
      startDate,
      endDate,
      subject,
      description,
      enrolmentCount,
    });

    // Save the new course in the database
    await newCourse.save();

    // Sends the newly created course back to the requester with 201 created status for successful creation
    res.status(201).send(newCourse);
  } catch (error) {
    // Sends error to requester if any server error in adding new course
    res.status(400).send({
      error: error._message,
    });
  }
});

// Instruction: Setup PUT /:id: Modify details of a course by its _id
router.put("/:id", async (req, res) => {
  try {
    // Retrieve the id from the URL parameter
    const _id = req.params.id;

    // Retrieve the required data from req.body
    const title = req.body.title;
    const instructor = req.body.instructor;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const subject = req.body.subject;
    const description = req.body.description;
    const enrolmentCount = req.body.enrolmentCount;

    // Checks if the ID is a valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({
        error: `Unrecognised MongoDB ID format: ${_id}!`,
      });
    }

    // Checks if there exists a course with the retrieved ID
    const existingCourseOne = await Course.findById(_id);

    // Sends an error to the requester if no matching course is found
    if (!existingCourseOne) {
      return res.status(400).send({
        error: `No such course with ID: ${_id} found!`,
      });
    }

    // Checks if at least one field is updated
    const notUpdatedCourse =
      existingCourseOne.title === title &&
      existingCourseOne.instructor === instructor &&
      existingCourseOne.startDate === startDate &&
      existingCourseOne.endDate === endDate &&
      existingCourseOne.subject === subject &&
      existingCourseOne.description === description &&
      existingCourseOne.enrolmentCount === enrolmentCount;

    // Sends an error to the requester if neither field was updated
    if (notUpdatedCourse) {
      return res.status(400).send({
        error: `No changes were made to the course details that require an update!`,
      });
    }

    // Check if all 2 required fields are filled up
    if (!title || !instructor) {
      // Sends an error to the requester if the conditions are not met
      return res.status(400).send({
        error: `The course's title and it's instructor is required!`,
      });
    }

    // Checks for a duplicate course
    const existingCourseTwo = Course.findOne({ title, instructor });

    // Sends an error to the requester if a duplicate course is found.
    if (existingCourseTwo) {
      return res.status(400).send({
        error: `The course ${title}, taught by ${instructor} has already been added!`,
      });
    }

    // If no errors above, update the course details.
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

    // Sends the newly updated course back to the requester with 200 OK status
    res.status(200).send(updatedCourse);
  } catch (error) {
    // Sends an error to the requester if any server error in updating course
    res.status(400).send({
      error: `Error updating course (ID: ${id}): ${error._message}`,
    });
  }
});

// Instruction: Setup DELETE /:id: Remove a course by its `_id`
router.delete("/:id", async (req, res) => {
  try {
    // Retrieve the id from the URL parameter
    const _id = req.params.id;

    // Checks if the id is a valid MongoDB id
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      // Sends an error to the requester if invalid MongoDB id
      return res.status(400).send({
        error: `Unrecognised MongoDB ID format: ${_id}!`,
      });
    }

    // Checks if there is a course with that specific id
    const course = await Course.findById(_id);
    if (!course) {
      // Sends an error to the requester if no course with that specific id is found
      return res.status(404).send({
        error: `No match for an course found with the ID: ${id}!`,
      });
    }

    // If no errors above, delete the course
    await Course.findByIdAndDelete(_id);

    // Send an alert to the requester to tell them the course has been sucesfully deleted.
    res.status(200).send({
      message: `Course with the provided ID: ${id} has been deleted!`,
    });
  } catch (error) {
    // Send an error to the requester if there is any server error in deleting the course
    res.status(400).send({
      error: `Error deleting course: ${error._message}`,
    });
  }
});

// Instruction: Export the router
module.exports = router;
