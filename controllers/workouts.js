const workoutRouter = require("express").Router()
const Workout = require("../models/workout")
const User = require("../models/user")
const { authenticateToken } = require("../utils/auth")

workoutRouter.post("/", async (req, res) => {
  const { name, createdByUserId } = req.body

  console.log(`body: ${name}, ${createdByUserId}`)

  const userFound = await User.findById(createdByUserId).populate("workouts")

  const workoutWithThisNameExists = userFound.workouts.find(
    (workout) => workout.name === name
  )
  if (workoutWithThisNameExists) {
    res.status(400).json({ error: "Workout with this name already exists" })
  }

  console.log(`Attempting to create a new workout...`)
  const newWorkout = new Workout({
    name: name,
    createdByUserId: createdByUserId,
  })

  console.log(newWorkout)

  const savedWorkout = await newWorkout.save()

  userFound.workouts.push(savedWorkout._id)
  await userFound.save()

  res.status(201).json(newWorkout)
})

workoutRouter.get("/", async (req, res) => {
  const { userId } = req.query

  const workouts = await Workout.find({ createdByUserId: userId })

  res.status(200).json(workouts)
})

workoutRouter.delete("/:id", authenticateToken, async (req, res) => {
  const idOfWorkoutToDelete = req.params.id
  const userId = req.userId

  console.log(`idOfWorkoutToDelete: ${idOfWorkoutToDelete}`)
  console.log(`userId: ${userId}`)

  // findbyIdAndDelete(idOfWorkoutToDelete)
  // User.findByIdAndUpdate(userId, {$pull: {workouts: workoutId}})

  res.json("hello")
})

module.exports = workoutRouter
