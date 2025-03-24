const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const workoutSchema = new mongoose.Schema({
  name: String,
  createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  exercises: [
    {
      exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
      plannedSets: { type: Number, default: 3 },
      plannedReps: { type: Number, default: 10 },
    }
  ],
}, { timestamps: true });

workoutSchema.plugin(uniqueValidator)

workoutSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    if (returnedObject.exercises && Array.isArray(returnedObject.exercises)) {
      returnedObject.exercises.forEach((exercise) => {
        if (exercise._id) {
          exercise.id = exercise._id.toString()
          delete exercise._id
        }
      })
    }
  },
})

module.exports = mongoose.model("Workout", workoutSchema)