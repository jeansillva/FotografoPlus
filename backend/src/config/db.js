export const connectDB = async () => {
  try {
    console.log("Banco de dados ainda não configurado. Usando mock em memória.");
  } catch (error) {
    console.error("Erro na conexão com o banco:", error.message);
    process.exit(1);
  }
};
