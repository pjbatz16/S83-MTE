const User = require("../models/User");
const Workout = require("../models/Workout");
const auth = require("../auth");

const { errorHandler } = auth;


module.exports.addWorkouts = (req, res) => {

    console.log(req.body);

    let newWorkout = new Workout({
        name: req.body.name,
        duration: req.body.duration,
        userId: req.body.userId
    });

    return newWorkout.save()
    .then(workout => {
        return res.status(201).send(workout);
    })
    .catch(err => {
        return res.status(500).send({ error: err.message });
    });

};

module.exports.getWorkout = (req, res) => {
    return Workout.find({userId : req.user.id})
        .then(workouts => {
            if (workouts.length > 0) {
                // if there are enrolled courses, return the enrollments.
                return res.status(200).send(workouts);
            }
            // if there is no enrolled courses, send a message 'No enrolled courses'.
            return res.status(404).send({
                message: 'No WorkOuts Added'
            });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.updateWorkout = (req, res) => {
    const workoutId = req.params.id;
    const updates = {
        name: req.body.name,
        duration: req.body.duration,
        status: req.body.status
    };

    Workout.findOneAndUpdate(
        { _id: workoutId, userId: req.user.id }, // ensure user owns workout
        { $set: updates },
        { returnDocument: 'after', runValidators: true }
    )
    .then(workout => {

        console.log("Workout ID from URL:", req.params.id);
        console.log("User ID from token:", req.user.id);
        if (!workout) {
            return res.status(404).send({ message: "Workout not found or not authorized" });
        }
        res.status(200).send({ message: "Workout updated successfully", workout });
    })
    .catch(err => res.status(500).send({ error: err.message }));
};

module.exports.deleteWorkout = (req, res) => {
    const workoutId = req.params.id;

    Workout.findOneAndDelete({ _id: workoutId, userId: req.user.id })
        .then(workout => {
            if (!workout) {
                return res.status(404).send({ message: "Workout not found or not authorized" });
            }
            res.status(200).send({ message: "Workout deleted successfully" });
        })
        .catch(err => res.status(500).send({ error: err.message }));
};