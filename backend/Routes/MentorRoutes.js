import express from "express";
import {
  mentorLogin,
  createClass,
  getTodaysClasses,
  resetPassword,
  forgotPassword,
  
} from "../Controller/MentorController.js";
import {
  authenticateToken,
  requireMentor,
} from "../middlewares/authMiddleawre.js";

const mentorroutes = express.Router();

// Login
mentorroutes.post("/mentorLogin", mentorLogin);
mentorroutes.post("/forgotPassword", forgotPassword);
mentorroutes.post("/resetPassword", resetPassword);


// Protected routes
mentorroutes.post("/createClass", createClass);
mentorroutes.get("/getTodaysClasses", authenticateToken, getTodaysClasses);

export default mentorroutes;
