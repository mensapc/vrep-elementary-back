import mongoose from "mongoose";
import TimeStampMiddleware from "../api/middlewares/timestamp";

const connectDB = (url: string) => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(url)
    .then(() => console.log("MongoDB connected"))
    .catch((error: Error) =>
      console.error("Error connecting to MongoDB:", error)
    );
};

mongoose.plugin((schema: any) => {
  TimeStampMiddleware(schema);
});

export default connectDB;
