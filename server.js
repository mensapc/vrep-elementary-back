const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error.middleware");
require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const authRoutes = require("./routes/auth.routes");
const examRoutes = require("./routes/exam.routes");
const questionRoutes = require("./routes/question.routes");
const optionRoutes = require("./routes/option.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 8080;

app.use("/", authRoutes);
app.use("/api/v1", examRoutes);
app.use("/api/v1", questionRoutes);
app.use("/api/v1", optionRoutes);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the RPMS API");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
