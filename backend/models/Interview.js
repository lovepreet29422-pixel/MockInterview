import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({

  role: String,

  experience: String,

  questions: Array,

  answers: Array,

  score: Number,

  durationMinutes: Number,

  date: {
    type: Date,
    default: Date.now
  }

});

const Interview =
  mongoose.model(
    "Interview",
    interviewSchema
  );

export default Interview;