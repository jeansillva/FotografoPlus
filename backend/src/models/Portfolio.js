import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    url: { type: String, required: true },        
    description: { type: String, default: "Sem descrição" },
    isPublic: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);
