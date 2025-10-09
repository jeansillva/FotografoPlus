import express from "express";
import {
  createPortfolioItem,
  getAllPortfolioItems,
  updatePortfolioItem,
  deletePortfolioItem,
} from "../controllers/portfolioController.js";

const router = express.Router();

router.post("/", createPortfolioItem);
router.get("/", getAllPortfolioItems);
router.put("/:id", updatePortfolioItem);
router.delete("/:id", deletePortfolioItem);

export default router;
