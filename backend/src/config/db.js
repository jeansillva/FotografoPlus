import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro na conexão com o banco:", error.message);
    process.exit(1);
  }
};

export default connectDB;
