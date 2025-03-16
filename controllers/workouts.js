const workoutRouter = require("express").Router()
const Workout = require("../models/workout")
const User = require("../models/user")
const { authenticateToken } = require("../utils/auth")



workoutRouter.post("/", authenticateToken, async (req, res) => {
  const { name } = req.body
  const userId = req.userId

  const userFound = await User.findById(userId).populate("workouts")

  const workoutWithThisNameExists = userFound.workouts.find(
    (workout) => workout.name === name
  )
  if (workoutWithThisNameExists) {
    res.status(400).json({ error: "Workout with this name already exists" })
  }

  const newWorkout = new Workout({
    name: name,
    createdByUserId: userId,
  })

  const savedWorkout = await newWorkout.save()

  userFound.workouts.push(savedWorkout._id)
  await userFound.save()
  
  res.status(201).json(savedWorkout)
})

workoutRouter.get("/", authenticateToken, async (req, res) => {
  const userId = req.userId

  const workouts = await Workout.find({ createdByUserId: userId })

  res.status(200).json(workouts)
})

workoutRouter.get("/:id", authenticateToken, async (req, res) => {
  const workoutId = req.params.id

  if (!workoutId) {
    return res.status(400).json({error: "Workout id is required"})
  }

  const workout = await Workout.findById(workoutId)

  if (!workout){
    return res.status(404).json({error: "Workout not found"})
  }

  res.status(200).json(workout)
})

workoutRouter.delete("/:id", authenticateToken, async (req, res) => {
  const idOfWorkoutToDelete = req.params.id;
  const userId = req.userId;

  try {
    const workoutToDelete = await Workout.findById(idOfWorkoutToDelete);

    if (!workoutToDelete) {
      return res.status(404).json({ error: "Workout with this id not found." });
    }

    await Workout.findByIdAndDelete(idOfWorkoutToDelete);
    await User.findByIdAndUpdate(userId, { $pull: { workouts: idOfWorkoutToDelete } });

    res.status(200).json({ message: "Workout deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the workout." });
  }
});

module.exports = workoutRouter
