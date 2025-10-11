import multer from "multer";
import Portfolio from "../models/Portfolio.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const createPortfolioItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!req.file) {
      return res.status(400).json({ message: "Imagem é obrigatória" });
    }

    const imageBase64 = req.file.buffer.toString("base64");
    const imageUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

    const newItem = await Portfolio.create({
      title,
      imageUrl,
      description,
      user: userId,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Erro ao criar item de portfólio:", error);
    res
      .status(500)
      .json({ message: "Erro ao criar item de portfólio", error: error.message });
  }
};

export const getAllPortfolioItems = async (req, res) => {
  try {
    const items = await Portfolio.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error("Erro ao buscar portfólio:", error);
    res.status(500).json({ message: "Erro ao buscar portfólio" });
  }
};

export const updatePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Portfolio.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ message: "Item não encontrado ou não pertence ao usuário" });

    res.status(200).json({ message: "Item atualizado com sucesso", updated });
  } catch (error) {
    console.error("Erro ao atualizar item de portfólio:", error);
    res.status(500).json({ message: "Erro interno ao atualizar" });
  }
};

export const deletePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Portfolio.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deleted)
      return res
        .status(404)
        .json({ message: "Item não encontrado ou não pertence ao usuário" });

    res.status(200).json({ message: "Item removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar item de portfólio:", error);
    res.status(500).json({ message: "Erro interno ao excluir" });
  }
};
