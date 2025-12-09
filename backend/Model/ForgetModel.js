import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  otp: { type: String },
  otpExpiry: { type: Date }
});

const ForgetModel =  mongoose.model("Forget", mentorSchema);
export default ForgetModel
