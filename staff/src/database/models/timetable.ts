import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  start_time: {
    type: String,
    required: true,
    enum: ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
  },
  end_time: {
    type: String,

    enum: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
  },
  course: {
    type: String,
  },
});

const Timetable = mongoose.model("Timetable", timetableSchema);
export default Timetable;
