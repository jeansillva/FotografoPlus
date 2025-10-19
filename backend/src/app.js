import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

import authRoutes from "./routes/authRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

import { authMiddleware } from "./middlewares/authMiddleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import "./config/googleAuth.js"; 

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.use("/api/schedules", authMiddleware, scheduleRoutes);
app.use("/api/portfolio", authMiddleware, portfolioRoutes);

app.get("/", (req, res) => {
  res.send("API rodando");
});

app.use(errorHandler);

process.on("uncaughtException", (err) => {
  console.error(`uncaughtException: ${err.stack || err}`);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error(`unhandledRejection: ${reason}`);
});

export default app;
