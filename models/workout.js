const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const workoutSchema = new mongoose.Schema({
  name: String,
  createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  exercises: [
    {
      exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
      instanceId: { type: String, required: true }, 
      plannedSets: { type: Number, default: 3 },
      plannedReps: { type: Number, default: 10 },
    }
  ],
});

workoutSchema.plugin(uniqueValidator)

workoutSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Workout", workoutSchema)
