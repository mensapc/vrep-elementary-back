import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: true,
  },
  staff: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
  student: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
