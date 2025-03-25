const exerciseRouter = require("express").Router()
const Exercise = require("../models/exercise")
const User = require("../models/user")
const jwt = require("jsonwebtoken")



// Create an exercise
exerciseRouter.post("/", async (request, response) => {
  const body = request.body
  
    const newExercise = new Exercise({
      name: body.name,
      muscleGroup: body.muscleGroup,
    })
    const savedExercise = await newExercise.save()
    response.json(savedExercise)
})
// Get all exercises
exerciseRouter.get("/", async (request, response) => {
  const exercises = await Exercise.find({})
  response.status(200).json(exercises)
})

module.exports = exerciseRouter
