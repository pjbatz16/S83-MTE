const express = require("express");
const workoutController = require("../controllers/workout");
const { verify } = require("../auth"); 

const router = express.Router();

// Add workout
router.post("/addWorkout", verify, workoutController.addWorkouts);

// Get my workouts
router.get("/getMyWorkouts", verify, workoutController.getWorkout);

// Update workout (PATCH)
router.patch("/updateWorkout/:id", verify, workoutController.updateWorkout);

// Delete workout
router.delete("/deleteWorkout/:id", verify, workoutController.deleteWorkout);

module.exports = router;