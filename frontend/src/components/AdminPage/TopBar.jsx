import React from "react";

function TopBar() {
  return (
    <div className="w-full bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 bg-white shadow-sm rounded-b-xl gap-3">

        {/* Left - Search */}
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Right - Icons & Profile */}
        <div className="flex items-center gap-5">
          <button className="text-xl">🔍</button>
          <button className="text-xl">🔔</button>

          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg">
            <img
              src="https://i.pravatar.cc/40"
              alt="User"
              className="rounded-full w-9 h-9 border"
            />
            <span className="hidden sm:block text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
