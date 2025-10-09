import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "A data do agendamento é obrigatória"],
    },
    title: {
      type: String,
      required: [true, "O título do agendamento é obrigatório"],
      trim: true,
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

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
