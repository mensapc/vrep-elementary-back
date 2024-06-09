import express, { Express } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
const errorMiddleware = require("./middlewares/error.middleware");
import activityRoutes from './src/activities/routes/routes';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", activityRoutes);

app.use(errorMiddleware);

app.get("/", (req, res) => res.status(200).send("Welcome to the RPMS API"));

export default app;
