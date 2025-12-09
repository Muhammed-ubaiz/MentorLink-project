import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MentorSideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("mentorToken");
    localStorage.removeItem("mentorId");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userType");

    // Redirect to mentor login
    navigate("/");
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="sm:hidden p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
        >
          ☰ Menu
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } sm:block sm:w-[16%] w-full bg-white text-gray-800 px-4 py-6 shadow-lg border-r border-gray-200`}
      >
        {/* Logo Section */}
        <div className="text-center border-b border-gray-300 pb-4 mb-6">
          <h1 className="text-2xl font-bold tracking-wide text-blue-600">
            MentorLink
          </h1>
          <p className="text-xs text-gray-500">Mentor Dashboard</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2 text-sm">
          <Link to="/fetchdashboard">
            <button className="flex items-center gap-3 py-2 px-3 rounded-md w-full hover:bg-blue-100 hover:text-blue-600 transition-all duration-200">
              <span className="text-lg">📊</span>
              <span>Dashboard</span>
            </button>
          </Link>

        <Link to="/fetchmentor">
            <button className="flex items-center gap-3 py-2 px-3 rounded-md w-full hover:bg-blue-100 hover:text-blue-600 transition-all duration-200">
              <span className="text-lg">👩‍🎓</span>
              <span>Mentor</span>
            </button>
          </Link>


          <Link to="/todayclass">
            <button className="flex items-center gap-3 py-2 px-3 rounded-md w-full hover:bg-blue-100 hover:text-blue-600 transition-all duration-200">
              <span className="text-lg">🕒</span>
              <span>Today's Session</span>
            </button>
          </Link>

          <Link to="/fetchcourses">
            <button className="flex items-center gap-3 py-2 px-3 rounded-md w-full hover:bg-blue-100 hover:text-blue-600 transition-all duration-200">
              <span className="text-lg">📚</span>
              <span>Courses</span>
            </button>
          </Link>

          

          {/* Divider */}
          <div className="border-t border-gray-300 my-4"></div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-2 px-3 w-full rounded-md bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <span className="text-lg">⏻</span>
            <span>Logout</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} MentorLink
        </div>
      </aside>
    </>
  );
}

export default MentorSideBar;
