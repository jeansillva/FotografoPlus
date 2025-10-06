export const errorHandler = (err, req, res, next) => {
  console.error("Erro:", err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Erro interno do servidor",
  });
};
