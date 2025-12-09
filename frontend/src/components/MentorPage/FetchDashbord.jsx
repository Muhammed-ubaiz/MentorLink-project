import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import CircularProgress from "../AdminPage/CircularProgress";
import Sidebar from "../AdminPage/Sidebar";
import TopBar from "../AdminPage/TopBar";
import axiosInstance from "../../../instance/axiosInstance";
import MentorSideBar from "./MentorSideBar";
import MentorTopBar from "./MentorTopBar";

const ShadowBar = (props) => {
    const { x, y, width, height, fill } = props;
    return (
        <>
            {/* Shadow */}
            <rect
                x={x}
                y={y + 4}
                width={width}
                height={height}
                fill="rgba(0,0,0,0.1)"
                rx={10}
                ry={10}
            />
            {/* Actual Bar */}
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fill}
                rx={10}
                ry={10}
            />
        </>
    );
};

const FetchDashbord = () => {
const [mentor, setMentor] = useState([]);
  const [count, setCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  const fetchMentor = async () => {
    try {
      const response = await axiosInstance.get("/admin/getMentor");
      setMentor(response.data);
      setCount(response.data.length);
    } catch (error) {
      console.error("Failed to fetch mentor", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("/admin/getCourse");
      setCourseCount(response.data.length);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get("/mentor/getTodaysClasses");
      setSessionCount(response.data.length);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  };

  useEffect(() => {
    fetchMentor();
    fetchCourses();
    fetchClasses();
  }, []);

  const sessionData = [
    { day: "Mon", present: 8, absent: 2 },
    { day: "Tue", present: 7, absent: 3 },
    { day: "Wed", present: 9, absent: 3 },
    { day: "Thu", present: 6, absent: 4 },
    { day: "Fri", present: 10, absent: 2 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <MentorSideBar/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <MentorTopBar />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <div className="bg-yellow-100 border-l-4 border-yellow-400 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Mentors</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{count}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>

          <div className="bg-green-100 border-l-4 border-green-400 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Courses</h3>
              <p className="text-3xl font-bold text-green-600 mt-1">{courseCount}</p>
            </div>
            <div className="text-4xl">📘</div>
          </div>

          <div className="bg-red-100 border-l-4 border-red-400 rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Sessions This Week</h3>
              <p className="text-3xl font-bold text-red-600 mt-1">{sessionCount}</p>
            </div>
            <div className="text-4xl">⏱</div>
          </div>
        </div>

        {/* Table & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6">
          {/* Mentor Table -- ✅ FIX APPLIED HERE */}
          <div className="col-span-2 bg-white rounded-xl shadow-md p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Mentor List
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 font-medium text-gray-600">#</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Name</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Course</th>
                </tr>
              </thead>
              <tbody>
                {mentor.map((m, index) => (
                  <tr
                    key={m._id}
                    className="hover:bg-gray-100 transition-all duration-200"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium">{m.name}</td>
                    <td className="px-4 py-2 text-gray-600">{m.course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts Section */}
          <div className="space-y-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Attendance Overview
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="present"
                    fill="#4ade80"
                    shape={<ShadowBar />}
                    barSize={20}
                  />
                  <Bar
                    dataKey="absent"
                    fill="#f87171"
                    shape={<ShadowBar />}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};
export default FetchDashbord;
