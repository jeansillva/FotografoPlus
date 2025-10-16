import express from "express";
import { registerUser, loginUser, updateUserCredentials } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/update-password", authMiddleware, updateUserCredentials);

export default router;