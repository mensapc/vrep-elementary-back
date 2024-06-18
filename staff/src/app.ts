import express from "express";
import "dotenv/config";
import staffRoutes from "./api/staff";
import connectDB from "./config/db";
import cors from "cors";

export const app = express();
const port = 8080;

if (process.env.NODE_ENV !== "test") {
  if (process.env.MONGODB_URL) connectDB(process.env.MONGODB_URL);
  else console.error("MONGODB_URL environment variable is not defined.");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v2/", staffRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
