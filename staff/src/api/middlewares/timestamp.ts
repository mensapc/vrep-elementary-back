import { Schema } from "mongoose";

const TimeStamp = function (schema: Schema) {
  schema.add({ created_at: Date, updated_at: Date });

  schema.pre("save", function (next) {
    const currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
      this.created_at = currentDate;
    }
    next();
  });
};

export default TimeStamp;
