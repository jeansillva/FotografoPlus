import express from "express";
import {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";

const router = express.Router();

router.get("/", getSchedules);
router.post("/", addSchedule);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

export default router;
