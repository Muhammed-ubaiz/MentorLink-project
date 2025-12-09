import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MentorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Forgot/Reset password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Login
  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/mentor/mentorlogin",
        { email, password }
      );

      if (response.data.success) {
        localStorage.setItem("mentorToken", response.data.token);
        localStorage.setItem("userType", response.data.userType);
        localStorage.setItem("mentorId", response.data.mentor.id);

        navigate("/fetchdashboard");
      } else {
        alert("Invalid credentials: " + response.data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  // Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3001/mentor/forgotPassword",
        { email: forgotEmail }
      );
      alert(res.data.message);
      setShowForgotModal(false);
      setShowResetModal(true); // show reset modal next
    } catch (err) {
      console.error("ForgotPassword error:", err.response?.data || err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Reset attempt:", { forgotEmail, otp, newPassword }); // Debug

    try {
      const res = await axios.post(
        "http://localhost:3001/mentor/resetPassword",
        {
          email: forgotEmail,
          otp,
          newPassword,
        }
      );
      alert(res.data.message);
      setShowResetModal(false);
    } catch (err) {
      console.error("ResetPassword error:", err.response?.data || err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="flex flex-col md:flex-row w-full max-w-4xl h-auto md:h-[70vh] bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-12 py-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            🔐 Mentor Login
          </h2>
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter mentor email"
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
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
            <p className="text-sm text-right">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </p>
          </form>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-6">
          <img
            src="https://res.cloudinary.com/danntnn1q/image/upload/v1753697776/Screenshot_2025-07-28_143258-removebg-preview_w7yufx.png"
            alt="Mentor Illustration"
            className="max-h-80 object-contain animate-pulse"
          />
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Forgot Password</h3>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg mb-4"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Send OTP
              </button>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-full mt-2 bg-gray-400 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Reset Password</h3>
            <form onSubmit={handleResetPassword}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-3 border rounded-lg mb-3"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full p-3 border rounded-lg mb-3"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full p-3 border rounded-lg mb-4"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg"
              >
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-full mt-2 bg-gray-400 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorLogin;
