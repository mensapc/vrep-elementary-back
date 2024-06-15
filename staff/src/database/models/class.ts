import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  staff: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
  ],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  courses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    },
  ],
});

const ClassModel = mongoose.model("Class", classSchema);
export default ClassModel;
