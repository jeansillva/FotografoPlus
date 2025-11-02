import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { registerUser, loginUser, updateUserCredentials, deleteUserById } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import "../config/googleAuth.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const user = req.user?.user || req.user;
    const token = req.user?.token || jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    const redirectBase = process.env.FRONTEND_URL;
    const redirectUrl = `${redirectBase}/portfolio?token=${token}&email=${encodeURIComponent(
      user.email
    )}&name=${encodeURIComponent(user.name)}`;

    res.redirect(redirectUrl);
  }
);

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