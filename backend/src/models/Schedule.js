import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    date: { type: Date, required: true },
    title: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Schedule", scheduleSchema);
