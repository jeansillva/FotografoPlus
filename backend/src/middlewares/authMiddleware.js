import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  if (process.env.DEV_NO_AUTH === "true" || process.env.DEV_NO_AUTH === undefined) {
    return next();
  }

  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.substring(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token ausente" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
