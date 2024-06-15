import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      default: "staff",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
    },
    _class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  },
  { versionKey: false }
);

const StaffModel = mongoose.model("Staff", staffSchema);
export default StaffModel;
