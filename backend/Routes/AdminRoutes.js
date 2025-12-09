import express from "express";
import {
  AdminLogin,
  createMentor,
  editMentor,
  getmentor,
  addCourse,
  getnewCourse,
  addBatch,
  getBatch,
  toggleMentorStatus,
  updateCourseStatus,
  sendOtp,
  verifyOtp,
  getAllTodaysClasses,
  //   adminLogout // Add this import
} from "../Controller/AdminController.js";
import {
  authenticateToken,
  requireAdmin,
} from "../middlewares/authMiddleawre.js";

const adminroutes = express();

// Public routes (no authentication required)
adminroutes.post("/adminlogin", AdminLogin);
adminroutes.post("/send-otp", sendOtp);
adminroutes.post("/verify-otp", verifyOtp);

// Protected routes (require admin authentication)
adminroutes.post(
  "/createMentor",
  authenticateToken,
  requireAdmin,
  createMentor
);
adminroutes.get("/getMentor", getmentor);
adminroutes.post("/editMentor", 
  authenticateToken, requireAdmin, 
  editMentor);
adminroutes.post("/addCourse", 
  authenticateToken, requireAdmin, 
  addCourse);
adminroutes.get("/getCourse", authenticateToken, getnewCourse);
adminroutes.post("/batch", 
  authenticateToken, requireAdmin, 
  addBatch);
adminroutes.get("/getBatch", getBatch);
adminroutes.put(
  "/toggleMentorStatus",
  authenticateToken,
  requireAdmin,
  toggleMentorStatus
);
adminroutes.put(
  "/updateCourseStatus",
  authenticateToken,
  requireAdmin,
  updateCourseStatus
);

adminroutes.get(
  "/getAllTodaysClasses",
  authenticateToken,   
  requireAdmin,
  getAllTodaysClasses
);
// adminroutes.post("/logout", authenticateToken, requireAdmin, adminLogout); // Add this route
// adminroutes.post("/showPassword", authenticateToken, requireAdmin, showPassword)

export default adminroutes;
