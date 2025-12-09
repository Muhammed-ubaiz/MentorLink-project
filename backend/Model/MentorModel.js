import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  { 
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    Number: {
      type: String, // store as string to keep leading 0s
      required: true,// ✅ only 10 digits allowed
    },
    password: { 
  type: String, 
  required: true,
    },

    course: { 
      type: String, 
      required: true,
    },
    isActive: {  
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Mentor = mongoose.model("Mentor", userSchema);

export default Mentor;
