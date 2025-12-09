import dotenv from "dotenv";
import ClassModel from "../Model/TodayClasses.js";
import { generateToken } from "../utils/tokenServices.js";
import Mentor from "../Model/MentorModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs"
import ForgetModel from "../Model/ForgetModel.js";

dotenv.config();

// ---------------- Mentor Login ----------------
export const mentorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const mentor = await Mentor.findOne({ email });
    if (!mentor) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password (assuming hashed passwords in DB)
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(mentor._id, "mentor");

    res.json({
      success: true,
      message: "Mentor login successful",
      token,
      userType: "mentor",
      mentor: {
        id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        course: mentor.course,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------- Create Class ----------------
export const createClass = async (req, res) => {
  try {
    const { subject, mentor, batch, time, date } = req.body;

    if (!subject || !batch || !mentor || !time || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingClass = await ClassModel.findOne({
      subject,
      mentor,
      batch,
      time,
      date: new Date(date),
    });

    if (existingClass) {
      return res.status(400).json({ message: "Class already exists" });
    }

    const newClass = new ClassModel({
      subject,
      mentor,
      batch,
      time,
      date: new Date(date),
    });

    await newClass.save();

    return res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Get Today's Classes ----------------
export const getTodaysClasses = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const classes = await ClassModel.find({
      date: { $gte: today, $lt: tomorrow },
    });

    return res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching today's classes:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const mentor = await Mentor.findOne({ email: email.toLowerCase() });
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete old OTP for this email (if exists)
    await ForgetModel.deleteMany({ email: mentor.email });

    // Save new OTP
    const otpStore = new ForgetModel({
      email: mentor.email,
      otp: otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await otpStore.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: process.env.APP_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("ForgotPassword Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    // Find OTP record
    const otpRecord = await ForgetModel.findOne({ email: email.toLowerCase() });
    if (!otpRecord) {
      return res.status(400).json({ message: "No OTP request found. Please try again." });
    }

    // Check expiry
    if (otpRecord.otpExpiry < Date.now()) {
      await ForgetModel.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // Check OTP match
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update Mentor password
    await Mentor.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: hashedPassword }
    );

    // Remove used OTP
    await ForgetModel.deleteOne({ email });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("ResetPassword Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
