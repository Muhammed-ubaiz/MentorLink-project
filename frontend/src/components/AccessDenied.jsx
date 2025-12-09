import React from "react";
import { useNavigate } from "react-router-dom";

function AccessDenied() {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  const handleGoBack = () => {
    if (userType === "admin") {
      navigate("/admindashboard");
    } else if (userType === "mentor") {
      navigate("/todayclass");
    } else {
      navigate("/adminlogin");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4">
      <h1 className="text-5xl font-bold text-red-600 mb-6">🚫 Access Denied</h1>
      <p className="text-gray-700 text-lg mb-6">
        You don’t have permission to view this page.
      </p>
      <button
        onClick={handleGoBack}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
      >
        Go Back
      </button>
    </div>
  );
}

export default AccessDenied;
