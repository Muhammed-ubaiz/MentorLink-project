import React, { useState, useEffect } from "react";
import TopBar from "../AdminPage/TopBar";
import Sidebar from "../AdminPage/Sidebar";
import axiosInstance from "../../../instance/axiosInstance";
import axios from "axios";
import MentorSideBar from "./MentorSideBar";
import MentorTopBar from "./MentorTopBar";
import Swal from "sweetalert2";


export default function TodaysClass() {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newClass, setNewClass] = useState({
    subject: "",
    mentor: "",
    batch: "",
    time: "",
    date: "",
  });

  // Dropdown states
  const [courses, setCourses] = useState([]);
  const [mentors, setMentor] = useState([]);
  const [batches, setBatches] = useState([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get("/mentor/getTodaysClasses");
      setClasses(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchMentor();
    fetchCourses();
    fetchBatch();
  }, []);

  // Handle form submission
  const handleAddClass = async (e) => {
  e.preventDefault();
  try {
    await axiosInstance.post("/mentor/createClass", newClass);
    fetchClasses();
    setShowForm(false);
    setNewClass({ subject: "", mentor: "", batch: "", time: "", date: "" });

    // ✅ Success Alert
    Swal.fire({
      icon: "success",
      title: "Class Added!",
      text: "The class has been added successfully.",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error adding class:", error);

    // ❌ Error Alert
    Swal.fire({
      icon: "error",
      title: "Failed to Add Class",
      text: error.response?.data?.message || "Something went wrong!",
    });
  }
};

  const fetchMentor = async () => {
    try {
      const response = await axiosInstance.get("/admin/getMentor");
      setMentor(response.data);
    } catch (error) {
      console.error("Failed to fetch mentor", error);
      alert("Failed to fetch mentor list.");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/admin/getCourse");
      const withStatus = res.data.map((c) => ({
        ...c,
        isActive: c.isActive || false,
      }));
      setCourses(withStatus);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchBatch = async () => {
    try {
      const response = await axiosInstance.get("/admin/getBatch");
      setBatches(response.data);
    } catch (err) {
      console.error("Failed to fetch batch:", err);
    }
  };

  // Helper functions to display names instead of IDs
  const getCourseName = (id) =>
    courses.find((c) => c._id === id)?.newCourse || "Unknown Course";

  const getMentorName = (id) =>
    mentors.find((m) => m._id === id)?.name || "Unknown Mentor";

  const getBatchName = (id) =>
    batches.find((b) => b._id === id)?.batch || "Unknown Batch";

  // Filter classes for right section
  const filteredClasses = classes.filter((cls) => {
    const course = getCourseName(cls.subject).toLowerCase();
    const mentor = getMentorName(cls.mentor).toLowerCase();
    const batch = getBatchName(cls.batch).toLowerCase();
    const time = cls.time.toLowerCase();

    return (
      course.includes(searchTerm.toLowerCase()) ||
      mentor.includes(searchTerm.toLowerCase()) ||
      batch.includes(searchTerm.toLowerCase()) ||
      time.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MentorSideBar />

      <div className="flex-1 flex flex-col">
        <MentorTopBar/>

        <div className="p-6 flex flex-col lg:flex-row gap-6 flex-1 overflow-y-auto">
          {/* Left Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Today’s Classes</h2>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + Add Class
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classes.map((cls, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 hover:shadow-md transition"
                >
                  <h3 className="text-base font-medium">{getCourseName(cls.subject)}</h3>
                  <p className="text-sm text-gray-500">{getMentorName(cls.mentor)}</p>
                  <p className="text-sm text-gray-500">{getBatchName(cls.batch)}</p>
                  <p className="mt-2 text-sm text-blue-600">{cls.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section with Search */}
          <div className="w-full max-w-xs">
            {/* Search Input */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            {/* Filtered Classes */}
            <div className="space-y-3 max-h-[75vh] overflow-y-auto">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 hover:bg-gray-50 transition"
                  >
                    <p className="text-sm font-medium">{getCourseName(cls.subject)}</p>
                    <p className="text-xs text-gray-500">{getBatchName(cls.batch)}</p>
                    <p className="text-xs text-gray-500">{cls.time}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No matching classes found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add New Class</h3>
            <form onSubmit={handleAddClass} className="space-y-3">
              {/* Course Dropdown */}
              <select
                value={newClass.subject}
                onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Course</option>
                {Array.isArray(courses) &&
                  courses.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.newCourse}
                    </option>
                  ))}
              </select>

              {/* Mentor Dropdown */}
              <select
                value={newClass.mentor}
                onChange={(e) => setNewClass({ ...newClass, mentor: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor._id} value={mentor._id}>
                    {mentor.name}
                  </option>
                ))}
              </select>

              {/* Batch Dropdown */}
              <select
                value={newClass.batch}
                onChange={(e) => setNewClass({ ...newClass, batch: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.batch}
                  </option>
                ))}
              </select>

              <input
                type="time"
                value={newClass.time}
                onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />

              <input
                type="date"
                value={newClass.date}
                onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

