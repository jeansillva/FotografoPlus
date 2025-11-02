import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, default: "" },
}, { timestamps: true });

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  photos: [photoSchema], 
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Album = mongoose.model("Album", albumSchema);
export default Album;