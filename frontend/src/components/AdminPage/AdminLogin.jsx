import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/admin/adminlogin",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response && response.data ? response.data : null;
      console.log("Login response:", data); // Debug log

      if (response.data.success) {
        // Store the token and user type in localStorage
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("userType", response.data.userType);
        
        // Navigate to admin dashboard
      navigate("/admindashboard");
      } else {
        alert("Invalid credentials: " + response.data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data) {
        alert("Error: " + err.response.data.message);
      } else {
        alert("Server error");
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="flex flex-col md:flex-row w-full max-w-4xl h-auto md:h-[70vh] bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        
        {/* Left Section (Form) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-12 py-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-['Lexend_Deca']">
            🔐 Admin Login
          </h2>
          <p className="text-gray-500 mb-8 text-center">
            Please enter your credentials to access the dashboard
          </p>
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter admin email"
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Login
            </button>
          </form>
        </div>

        {/* Right Section (Illustration) */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-6">
          <img
            src="https://res.cloudinary.com/danntnn1q/image/upload/v1753697776/Screenshot_2025-07-28_143258-removebg-preview_w7yufx.png"
            alt="Admin Illustration"
            className="max-h-80 object-contain animate-pulse"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
