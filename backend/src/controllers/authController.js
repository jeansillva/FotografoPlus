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

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Preencha todos os campos." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Usuário já cadastrado." });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      message: "Usuário registrado com sucesso!",
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Dados inválidos", error: error.message });
    }
    return res.status(500).json({ message: "Erro ao registrar usuário.", error: error.message });
  }
};


export const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const requesterId = req.user?.id || req.user?._id;

    if (!requesterId) {
      return res.status(401).json({ message: "Token inválido ou não fornecido." });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json({ message: "Usuário deletado com sucesso.", id: user._id });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar usuário.", error: error.message });
  }
};

export const updateUserCredentials = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    if (name) user.name = name;

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Preencha todos os campos de senha." });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Senha atual incorreta." });
      }
      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      message: "Credenciais atualizadas com sucesso!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar credenciais.", error: error.message });
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
