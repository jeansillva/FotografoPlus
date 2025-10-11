import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";

import { authMiddleware } from "./middlewares/authMiddleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));


app.use("/api/auth", authRoutes);

app.use("/api/schedules", authMiddleware, scheduleRoutes);
app.use("/api/portfolio", authMiddleware, portfolioRoutes);

app.get("/", (req, res) => {
  res.send("API rodando");
});

app.use(errorHandler);

export default app;
