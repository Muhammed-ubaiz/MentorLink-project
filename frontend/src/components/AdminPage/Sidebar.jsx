import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Mentor from './Mentor';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove all authentication-related items from localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('mentorToken');
    localStorage.removeItem("mentorId");
    // localStorage.removeItem('studentToken');
    localStorage.removeItem('userType');

    // Redirect to login page
    navigate('/adminlogin');
  };
  return (
    <>
      {/* Toggle button for mobile */}
      <div className="sm:hidden p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
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
    <h1 className="text-2xl font-bold tracking-wide text-blue-600">MentorLink</h1>
    <p className="text-xs text-gray-500">Admin Dashboard</p>
  </div>

  {/* Navigation Menu */}
  <nav className="flex flex-col gap-3 text-sm">
    <Link to="/admindashboard">
      <button className="flex items-center gap-3 py-2 px-3 rounded-md w-full hover:bg-blue-100 hover:text-blue-600 transition-all">
        <span className="text-lg">📊</span>
        <span>Dashboard</span>
      </button>
    </Link>

    <Link to="/mentor">
      <button className="flex items-center gap-3 py-2 px-3 rounded-md w-full hover:bg-blue-100 hover:text-blue-600 transition-all">
        <span className="text-lg">👨‍🏫</span>
        <span>Mentors</span>
      </button>
    </Link>

    <Link to="/sessions">
      <button className="flex items-center gap-3 py-2 px-3 rounded-md w-full hover:bg-blue-100 hover:text-blue-600 transition-all">
        <span className="text-lg">🕒</span>
        <span>Sessions</span>
      </button>
    </Link>

    <Link to="/course">
      <button className="flex items-center gap-3 py-2 px-3 rounded-md w-full hover:bg-blue-100 hover:text-blue-600 transition-all">
        <span className="text-lg">📚</span>
        <span>Courses</span>
      </button>
    </Link>

    {/* Divider */}
    <div className="border-t border-gray-300 my-3"></div>

    {/* Logout Button */}
    <Link to="/adminlogin">
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 py-2 px-3 w-full rounded-md bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
      >
        <span className="text-lg">⏻</span>
        <span>Logout</span>
      </button>
    </Link>
  </nav>

  {/* Footer */}
  <div className="mt-10 text-center text-xs text-gray-400">
    © 2025 MentorLink
  </div>
</aside>

    </>
  );
}

export default Sidebar;
