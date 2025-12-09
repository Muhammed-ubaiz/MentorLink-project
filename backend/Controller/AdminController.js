import Batch from "../Model/BatchModel.js";
import NewCourse from "../Model/CourseModel.js";
import Mentor from "../Model/MentorModel.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import OTP from "../Model/OtpModel.js";
import { generateToken } from "../utils/tokenServices.js";
// import bcrypt from "bcryptjs";
dotenv.config();

const adminemail = "admin@gmail.com";
const adminpass = "admin123";

export const AdminLogin = (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (email === adminemail && password === adminpass) {
    // Generate token for admin
    const token = generateToken(email, "admin");
    // setTokenCookie(res, token);

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      userType: "admin",
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

export const createMentor = async (req, res) => {
  try {
    const { name, email, number, password, course } = req.body;
    console.log(req.body);

    if (!name || !email || !number || !password || !course) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingMentor = await Mentor.findOne({ email: req.body.email });
    if (existingMentor) {
      return res
        .status(409)
        .json({ message: "Mentor with this email already exists" });
    }

    const newMentor = new Mentor({ name, email, Number:number, password, course });
    await newMentor.save();

    res.status(201).json({
      message: "Mentor created successfully",
      mentor: newMentor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getmentor = async (req, res) => {
  try {
    const mentor = await Mentor.find();
    res.json(mentor);
    console.log(res.body);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch mentors" });
  }
};

export const editMentor = async (req, res) => {
  try {
    const { name, email, number, course, selectEmail } = req.body;
    console.log(req.body);
    const data = await Mentor.updateOne(
      { email: selectEmail },
      {
        $set: {
          name: name,
          email: email,
          Number: number,
          course: course,
        },
      }
    );
    return res.send(data);
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { newCourse, newDuration } = req.body;
    console.log(req.body);

    if (!newCourse || !newDuration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCourse = await NewCourse.findOne({ newCourse, newDuration });
    if (existingCourse) {
      return res.status(409).json({ message: "Course already exists" });
    }

    const courseData = new NewCourse({
      newCourse: req.body.newCourse,
      newDuration: req.body.newDuration,
    });

    await courseData.save();

    res.status(201).json({
      message: "Course Created Successfully",
      newCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(300).json({ message: error.message });
  }
};

export const getnewCourse = async (req, res) => {
  try {
    const newCourse = await NewCourse.find();

    res.json(newCourse);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// controller/adminController.js
export const addBatch = async (req, res) => {
  try {
    const { courseId, batch } = req.body;

    if (!courseId || !batch) {
      return res
        .status(400)
        .json({ message: "Course ID and batch name are required" });
    }

    // Check duplicate only within the same course
    const existingBatch = await Batch.findOne({ courseId, batch });
    if (existingBatch) {
      return res
        .status(400)
        .json({ message: "Batch already exists for this course" });
    }

    const newBatch = new Batch({ courseId, batch });
    await newBatch.save();

    res.status(201).json({
      message: "Batch added successfully",
      newBatch,
    });
  } catch (error) {
    console.error("Error adding batch:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getBatch = async (req, res) => {
  try {
    const batch = await Batch.find();

    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Batch" });
  }
};

// Toggle Mentor Status
export const toggleMentorStatus = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Mentor ID is required" });
    }

    const mentor = await Mentor.findById(id);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    mentor.isActive = !mentor.isActive; // Flip status
    await mentor.save();

    res.json({
      message: `Mentor status updated successfully`,
      mentor,
    });
  } catch (error) {
    console.error("Toggle Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// updateCourseStatus
export const updateCourseStatus = async (req, res) => {
  try {
    const { courseId, isActive } = req.body;
    if (!courseId)
      return res.status(400).json({ message: "Course ID is required" });

    const course = await NewCourse.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.isActive = isActive; // directly set from frontend
    await course.save();

    res.json({ message: "Status updated", course });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
let otpStore = [];
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // expire in 5 min

  // await OTP.findOneAndUpdate(
  //   {email},
  //   {otp,createdAt:now Data()}
  // )

  // Explicit Gmail SMTP settings
  const transporter = nodemailer.createTransport({
    service: "gmail", // true for 465, false for 587
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD, // 16-char Gmail App Password
    },
    tls: {
      rejectUnauthorized: false, // allow self-signed certs (only if needed)
    },
  });

  try {
    await transporter.sendMail({
      from: `"MENTOR LINK" <${process.env.APP_EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("Email sending failed:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify OTP
export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) {
    return res.json({ success: false, message: "No OTP found for this email" });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.json({ success: false, message: "OTP expired" });
  }

  if (record.otp.toString() === otp) {
    delete otpStore[email];
    return res.json({ success: true, message: "OTP verified" });
  }

  res.json({ success: false, message: "Invalid OTP" });
};

// Get all today's classes (Admin)
export const getAllTodaysClasses = async (req, res) => {  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Fetch all classes between today and tomorrow
    const classes = await ClassModel.find({
      date: { $gte: today, $lt: tomorrow },
    })
      .populate("mentor") // optional: populate mentor details
      .populate("subject") // if subject is a ref to Course
      .populate("batch"); // if batch is a ref

    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching all today's classes for admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};
