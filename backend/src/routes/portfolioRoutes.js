import express from "express";
import {
  getPhotos,
  addPhoto,
  updatePhoto,
  deletePhoto,
} from "../controllers/portfolioController.js";

const router = express.Router();

router.get("/", getPhotos);
router.post("/", addPhoto);
router.put("/:id", updatePhoto);
router.delete("/:id", deletePhoto);

export default router;
