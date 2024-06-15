//@ts-ignore
const TimeStamp = function (schema) {
  schema.add({ created_at: Date, updated_at: Date });

  //@ts-ignore
  schema.pre("save", function (next) {
    const currentDate = new Date();
    //@ts-ignore
    this.updated_at = currentDate;
    //@ts-ignore
    if (!this.created_at) {
      //@ts-ignore
      this.created_at = currentDate;
    }
    next();
  });
};

export default TimeStamp;
