import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Preencha todos os campos." });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Usuário já cadastrado." });

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      message: "Usuário registrado com sucesso!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar usuário.", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Usuário não encontrado." });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Senha incorreta." });

    return res.status(200).json({
      message: "Login bem-sucedido!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login.", error: error.message });
  }
};
