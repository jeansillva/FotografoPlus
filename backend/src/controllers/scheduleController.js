let schedules = [
  { id: 1, date: "2025-09-25", title: "Ensaio Fotográfico" },
  { id: 2, date: "2025-09-28", title: "Casamento" },
];

export const getSchedules = (req, res) => {
  res.json(schedules);
};

export const addSchedule = (req, res) => {
  const { date, title } = req.body;
  if (!date || !title) {
    return res.status(400).json({ message: "Data e título são obrigatórios" });
  }
  const newSchedule = { id: Date.now(), date, title };
  schedules.push(newSchedule);
  res.status(201).json(newSchedule);
};

export const updateSchedule = (req, res) => {
  const { id } = req.params;
  const { date, title } = req.body;

  const schedule = schedules.find((s) => s.id == id);
  if (!schedule) return res.status(404).json({ message: "Agendamento não encontrado" });

  schedule.date = date || schedule.date;
  schedule.title = title || schedule.title;

  res.json(schedule);
};

export const deleteSchedule = (req, res) => {
  const { id } = req.params;
  schedules = schedules.filter((s) => s.id != id);
  res.json({ message: "Agendamento removido com sucesso" });
};
