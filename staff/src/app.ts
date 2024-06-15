import express from "express";
import "dotenv/config";
import staffRoutes from "./api/staff";
import connectDB from "./config/db";
import cors from "cors";

const app = express();
const port = 8080;

//@ts-ignore
connectDB(process.env.MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v2/", staffRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
