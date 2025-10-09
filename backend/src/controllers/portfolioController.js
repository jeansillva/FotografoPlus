import Portfolio from "../models/Portfolio.js";

export const createPortfolioItem = async (req, res) => {
  try {
    const { title, imageUrl, description } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ message: "Título e imagem são obrigatórios" });
    }

    const newItem = new Portfolio({
      title,
      imageUrl,
      description,
      user: req.user.id, 
    });

    await newItem.save();
    res.status(201).json({ message: "Item criado com sucesso!", newItem });
  } catch (error) {
    console.error("Erro ao criar item de portfólio:", error);
    res.status(500).json({ message: "Erro interno ao criar portfólio" });
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

    if (!updated) return res.status(404).json({ message: "Item não encontrado ou não pertence ao usuário" });
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

    if (!deleted) return res.status(404).json({ message: "Item não encontrado ou não pertence ao usuário" });
    res.status(200).json({ message: "Item removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar item de portfólio:", error);
    res.status(500).json({ message: "Erro interno ao excluir" });
  }
};
