import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    newCourse: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    newDuration: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt automatically
);

const NewCourse = mongoose.model("NewCourse", courseSchema);

export default NewCourse;
