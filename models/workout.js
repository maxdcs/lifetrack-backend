const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const workoutSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  createdByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exercises: [
    {
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
        required: true,
      },
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
    },
  ],
})

workoutSchema.plugin(uniqueValidator)

workoutSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Workout", workoutSchema)
