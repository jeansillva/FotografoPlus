export const errorHandler = (err, req, res, next) => {
  console.error("Erro:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Erro interno no servidor" });
};
