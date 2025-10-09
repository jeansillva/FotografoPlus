import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "O título é obrigatório"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "A URL da imagem é obrigatória"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
