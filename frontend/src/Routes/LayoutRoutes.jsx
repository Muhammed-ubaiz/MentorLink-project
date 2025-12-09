import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "../components/AdminPage/AdminLogin";
import AdminDashbord from "../components/AdminPage/AdminDashbord";
import Mentor from "../components/AdminPage/Mentor";
import TodaysClass from "../components/MentorPage/TodayClass";
import Course from "../components/AdminPage/Course";
import MentorLogin from "../components/MentorPage/MentorLogin";
import Sessions from "../components/AdminPage/Sessions";
import FetchCourses from "../components/MentorPage/FetchCourses";
import FetchMentor from "../components/MentorPage/FetchMentor";
import FetchDashbord from "../components/MentorPage/FetchDashbord";
import PrivateRoute from "../protect/PrivateRoute";
import AccessDenied from "../components/AccessDenied";

// ✅ Import new pages

function LayoutRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/" element={<MentorLogin />} />

        

        {/* 🔒 Admin Protected Routes */}
        <Route
          path="/admindashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashbord />
            </PrivateRoute>
          }
        />
        <Route
          path="/mentor"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Mentor />
            </PrivateRoute>
          }
        />
        <Route
          path="/course"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Course />
            </PrivateRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Sessions />
            </PrivateRoute>
          }
        />

        {/* 🔒 Mentor Protected Routes */}
        <Route
          path="/todayclass"
          element={
            <PrivateRoute allowedRoles={["mentor"]}>
              <TodaysClass />
            </PrivateRoute>
          }
        />
        <Route
          path="/fetchcourses"
          element={
            <PrivateRoute allowedRoles={["mentor"]}>
              <FetchCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/fetchmentor"
          element={
            <PrivateRoute allowedRoles={["mentor"]}>
              <FetchMentor />
            </PrivateRoute>
          }
        />
        <Route
          path="/fetchdashboard"
          element={
            <PrivateRoute allowedRoles={["mentor"]}>
              <FetchDashbord />
            </PrivateRoute>
          }
        />

        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </BrowserRouter>
  );
}

export default LayoutRoutes;
