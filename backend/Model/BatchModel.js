import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  batch: { type: String, required: true },
});

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
