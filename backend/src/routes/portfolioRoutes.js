import express from "express";
import {
  createPortfolioItem,
  getAllPortfolioItems,
  updatePortfolioItem,
  deletePortfolioItem,
  getPortfolioImage,
  upload,
} from "../controllers/portfolioController.js";

const router = express.Router();

router.post("/", upload.single("image"), createPortfolioItem);
router.get("/", getAllPortfolioItems);
router.get("/:id/image", getPortfolioImage); 
router.put("/:id", updatePortfolioItem);
router.delete("/:id", deletePortfolioItem);

export default router;