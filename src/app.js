import express from "express";
import cors from "cors";
import morgan from "morgan";
import {notFound, errorHandler} from "./middlewares/errorHandler.js"
import healthRouter from "./routes/healthRouter.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(morgan("dev"));


app.use("/api",healthRouter); //use this /api
app.use(notFound);
app.use(errorHandler);

export default app


