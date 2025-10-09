import Schedule from "../models/Schedule.js";

export const createSchedule = async (req, res) => {
  try {
    const { date, title, description } = req.body;

    if (!date || !title) {
      return res.status(400).json({ message: "Data e título são obrigatórios" });
    }

    const newSchedule = new Schedule({
      date,
      title,
      description,
      user: req.user.id, 
    });

    await newSchedule.save();
    res.status(201).json({ message: "Agendamento criado com sucesso", newSchedule });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    res.status(500).json({ message: "Erro interno ao criar agendamento" });
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user.id }).sort({ date: 1 });
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({ message: "Erro ao buscar agendamentos" });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Schedule.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Agendamento não encontrado ou não pertence ao usuário" });
    res.status(200).json({ message: "Agendamento atualizado com sucesso", updated });
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    res.status(500).json({ message: "Erro interno ao atualizar" });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Schedule.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deleted) return res.status(404).json({ message: "Agendamento não encontrado ou não pertence ao usuário" });
    res.status(200).json({ message: "Agendamento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    res.status(500).json({ message: "Erro interno ao excluir" });
  }
};
