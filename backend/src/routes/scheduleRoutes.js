import express from "express";
import {
  createSchedule,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSchedule);
router.get("/", authMiddleware, getAllSchedules);
router.put("/:id", authMiddleware, updateSchedule);
router.delete("/:id", authMiddleware, deleteSchedule);

export default router;
