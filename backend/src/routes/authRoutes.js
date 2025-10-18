import express from "express";
import { registerUser, loginUser, updateUserCredentials, deleteUserById } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/update-password", authMiddleware, updateUserCredentials);
router.delete("/users/:id", authMiddleware, deleteUserById);

// (APENAS dev/test)
if (process.env.NODE_ENV !== "production") {
  router.delete("/test/users", async (req, res) => {
    try {
      const email = req.body.email || req.query.email;
      if (!email) return res.status(400).json({ message: "email é obrigatório" });
      const result = await User.deleteMany({ email });
      return res.status(200).json({ deletedCount: result.deletedCount });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar usuário (test route).", error: error.message });
    }
  });
}

export default router;