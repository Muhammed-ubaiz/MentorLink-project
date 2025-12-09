import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true }, // ✅ added batch
  time: { type: String, required: true },
  date: { type: Date, required: true },
});

const ClassModel = mongoose.model("Class", classSchema);
export default ClassModel;
