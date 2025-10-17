import multer from "multer";
import Portfolio from "../models/Portfolio.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const createPortfolioItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "Imagem é obrigatória" });
    }

    const base64 = req.file.buffer.toString("base64");
    const mime = req.file.mimetype || "image/jpeg";
    const dataUri = `data:${mime};base64,${base64}`;

    const newItem = await Portfolio.create({
      title,
      description,
      user: userId,
      imageUrl: dataUri,
      imageBase64: dataUri,
      imageMimeType: mime,
    });

    res.status(201).json({ newItem });
  } catch (error) {
    console.error("Erro ao criar item de portfólio:", error);
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: "Dados inválidos", error: error.message });
    }
    res.status(500).json({ message: "Erro ao criar item de portfólio", error: error.message });
  }
};

export const getAllPortfolioItems = async (req, res) => {
  try {
    const items = await Portfolio.find().sort({ createdAt: -1 });

    const result = items.map((it) => ({
      _id: it._id,
      title: it.title,
      description: it.description,
      imageUrl: `${process.env.BASE_URL || ""}/api/portfolio/${it._id}/image`,
      createdAt: it.createdAt,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar portfólio", error: error.message });
  }
};

export const getPortfolioImage = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Portfolio.findById(id);
    if (!item) return res.status(404).json({ message: "Imagem não encontrada" });

    let base64 = item.imageBase64 || item.imageData || item.imageUrl;
    if (!base64 && item.imagePath) {
      return res.sendFile(item.imagePath, { root: process.cwd() });
    }

    const matches = base64 && base64.match(/^data:(.+);base64,(.+)$/);
    let mime = "image/jpeg";
    let dataBase64 = base64;
    if (matches) {
      mime = matches[1];
      dataBase64 = matches[2];
    }

    const imgBuffer = Buffer.from(dataBase64, "base64");
    res.set("Content-Type", mime);
    res.send(imgBuffer);
  } catch (err) {
    res.status(500).json({ message: "Erro ao obter imagem", error: err.message });
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
