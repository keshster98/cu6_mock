// Import express
const express = require("express");

// Import mongoose (Nice one Sir, you didn't include this and almost made me forget this)
const mongoose = require("mongoose");

// Create a router for instructors
const router = express.Router();

// Instruction: Import the instructor model
const Instructor = require("../models/instructor");

// Instruction: GET /: List all instructors
router.get("/", async (req, res) => {
  try {
    // Get all instructors
    const instructors = await Instructor.find();
    // Send retrieved instructors data to requester
    res.status(200).send(instructors);
  } catch (error) {
    // Send error message if any server error in retrieving instructors
    res
      .status(400)
      .send({ error: `Error fetching instructors: ${error._message}` });
  }
});

// Instruction: Setup GET /:id: Get a specific instructor by its _id
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

    // If no errors above, get the specific instructor
    const instructor = await Instructor.findById(_id);

    // If instructor exists, send the instructor to the requester
    if (instructor) {
      res.status(200).send(instructor);

      // If instructor does not exist, send an error to the requester
    } else {
      res
        .status(400)
        .send({ error: `No such instructor with ID: ${_id} found!` });
    }
  } catch (error) {
    // Send error message if any server error in retrieving the specific instructor
    res.status(400).send({
      error: `Error fetching instructor: ${error._message}`,
    });
  }
});

// Instruction: Setup POST /: Add a new instructor
router.post("/", async (req, res) => {
  try {
    // Retrieve the required data from req.body
    const name = req.body.name;
    const qualification = req.body.qualification;
    const profile = req.body.profile;
    const coursesTaught = req.body.coursesTaught;

    // Check if the 1 required field is filled up
    if (!name) {
      // Sends an error to the requester if conditions are not met
      return res.status(400).send({
        error: `The instructor's name is required!`,
      });
    }

    // Checks for a duplicate instructor
    // Only name and profile considered because no two instructor's both name and profile can be a perfect match
    const existingInstructor = await Instructor.findOne({ name, profile });
    if (existingInstructor) {
      // Sends an error to the requester if a duplicate instructor is found
      return res.status(400).send({
        error: `The instructor, ${name} has already been added!`,
      });
    }

    // If no errors above, add the new instructor
    const newInstructor = new Instructor({
      name,
      qualification,
      profile,
      coursesTaught,
    });

    // Save the new instructor in the database
    await newInstructor.save();

    // Sends the newly created instructor back to the requester with 201 created status for successful creation
    res.status(201).send(newInstructor);
  } catch (error) {
    // Sends error to requester if any server error in adding new instructor
    res.status(400).send({
      error: error._message,
    });
  }
});

// Instruction: Setup PUT /:id: Update a instructor by its _id
router.put("/:id", async (req, res) => {
  try {
    // Retrieve the id from the URL parameter
    const _id = req.params.id;

    // Retrieve the required data from req.body
    const name = req.body.name;
    const qualification = req.body.qualification;
    const profile = req.body.profile;
    const coursesTaught = req.body.coursesTaught;

    // Checks if the ID is a valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).send({
        error: `Unrecognised MongoDB ID format: ${_id}!`,
      });
    }

    // Checks if there exists a instructor with the retrieved ID
    const existingInstructorOne = await Instructor.findById(_id);

    // Sends an error to the requester if no matching instructor is found
    if (!existingInstructorOne) {
      return res.status(400).send({
        error: `No such instructor with ID: ${_id} found!`,
      });
    }

    // Checks if at least one field is updated
    const notUpdatedInstructor =
      existingInstructorOne.name === name &&
      existingInstructorOne.qualification === qualification &&
      existingInstructorOne.profile === profile &&
      existingInstructorOne.coursesTaught === coursesTaught;

    // Sends an error to the requester if neither field was updated
    if (notUpdatedInstructor) {
      return res.status(400).send({
        error: `No changes were made to the instrutor details that require an update!`,
      });
    }

    // Check if the 1 required field is filled up
    if (!name) {
      // Sends an error to the requester if the conditions are not met
      return res.status(400).send({
        error: `The instructor's name is required!`,
      });
    }

    // Checks for a duplicate instructor
    const existingInstructorTwo = Instructor.findOne({ name, profile });

    // Sends an error to the requester if a duplicate instructor is found.
    if (existingInstructorTwo) {
      return res.status(400).send({
        error: `The instructor, ${name} has already been added!`,
      });
    }

    // If no errors above, update the instructor details.
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

    // Sends the newly updated instructor back to the requester with 200 OK status
    res.status(200).send(updatedInstructor);
  } catch (error) {
    // Sends an error to the requester if any server error in updating instructor
    res.status(400).send({
      error: `Error updating instructor with ID ${_id}: ${error._message}`,
    });
  }
});

// Instruction: Setup DELETE /:id: Delete a instructor by its _id
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

    // Checks if there is a instructor with that specific id
    const instructor = await Instructor.findById(_id);
    if (!instructor) {
      // Sends an error to the requester if no instructor with that specific id is found
      return res.status(404).send({
        error: `No match for an instructor found with ID: ${_id}!`,
      });
    }

    // If no errors above, delete the instructor
    await Instructor.findByIdAndDelete(_id);

    // Send an alert to the requester to tell them the instructor has been sucesfully deleted.
    res.status(200).send({
      message: `Instructor with ID: ${_id} has been deleted!`,
    });
  } catch (error) {
    // Send an error to the requester if there is any server error in deleting the instructor
    res.status(400).send({
      error: `Error deleting instructor: ${error._message}`,
    });
  }
});

// Instruction: Export the router
module.exports = router;
