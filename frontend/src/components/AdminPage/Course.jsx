import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import Sidebar from "../AdminPage/Sidebar";
import axiosInstance from "../../../instance/axiosInstance";
import Swal from "sweetalert2";

const Course = () => {
  const [courseShowModal, setCourseShowModal] = useState(false);
  const [batchShowModal, setBatchShowModal] = useState(false);

  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseDuration, setCourseDuration] = useState("");

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [batches, setBatches] = useState([]);
  const [batch, setBatch] = useState("");

  // New state for search
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch courses
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

  // Fetch batches
  const fetchBatch = async () => {
    try {
      const response = await axiosInstance.get("/admin/getBatch");
      setBatches(response.data);
    } catch (err) {
      console.error("Failed to fetch batch:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchBatch();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/addCourse", {
        newCourse: courseName,
        newDuration: courseDuration,
      });
      setCourseShowModal(false);
      setCourseName("");
      setCourseDuration("");
      fetchCourses();

      Swal.fire({
        icon: "success",
        title: "Course Added!",
        text: "The course has been added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Add Course",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  const toggleStatus = async (courseId, currentStatus) => {
    try {
      await axiosInstance.put("/admin/updateCourseStatus", {
        courseId,
        isActive: !currentStatus,
      });

      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId ? { ...c, isActive: !c.isActive } : c
        )
      );

      Swal.fire({
        icon: "success",
        title: !currentStatus ? "Activated!" : "Inactivated!",
        text: `Course has been ${!currentStatus ? "activated" : "deactivated"} successfully`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error toggling status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    if (!batch.trim() || !selectedCourseId) return;

    try {
      const response = await axiosInstance.post("/admin/batch", {
        courseId: selectedCourseId,
        batch: batch,
      });

      setBatches((prev) => [...prev, response.data.newBatch]);
      setBatch("");

      Swal.fire("Success", response.data.message, "success");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Duplicate Batch",
        text: error.response?.data?.message || "This batch already exists for the course",
      });
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    return course ? course.newCourse : "Unknown Course";
  };

  // Filter courses by search term
  const filteredCourses = courses.filter(
    (c) =>
      c.newCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.newDuration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen font-sans text-gray-800">
      <Sidebar />
      <div className="w-full bg-gray-50">
        {/* <TopBar /> */}

        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Courses</h1>

              {/* Search Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Course list */}
              <div className="space-y-3 overflow-x-auto overflow-y-auto max-h-[550px]">
                {Array.isArray(filteredCourses) &&
                  filteredCourses.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between bg-gray-50 rounded-md p-4 border "
                    >
                      <div>
                        <h2 className="text-lg font-semibold">{item.newCourse}</h2>
                        <p className="text-sm text-gray-600">Duration: {item.newDuration}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedCourseId(item._id);
                            setBatchShowModal(true);
                          }}
                          className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                        >
                          View Batches
                        </button>
                        <button
                          onClick={() => toggleStatus(item._id, item.isActive)}
                          className={`px-3 py-1 text-sm rounded-md border ${
                            item.isActive
                              ? "bg-green-200 text-green-800 border-green-600"
                              : "bg-red-200 text-red-800 border-red-600"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setCourseShowModal(true)}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add New Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      {courseShowModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-bold mb-4">Add New Course</h2>
            <input
              type="text"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full border rounded-md p-2 mb-3"
            />
            <input
              type="text"
              placeholder="Duration"
              value={courseDuration}
              onChange={(e) => setCourseDuration(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCourseShowModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Modal */}
      {batchShowModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Add Batch</h2>
            <input
              type="text"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="Enter batch name"
              className="w-full border rounded-md p-2 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddBatch}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md"
              >
                Add
              </button>
              <button
                onClick={() => setBatchShowModal(false)}
                className="flex-1 bg-gray-200 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>

            {/* Batch list */}
            <ul className="mt-4 list-disc pl-6">
              {batches
                ?.filter((b) => b.courseId === selectedCourseId)
                .map((item, index) => (
                  <li key={item?._id || index}>
                    <span className="font-semibold">{item.batch}</span> —{" "}
                    <span className="text-gray-600">{getCourseName(item.courseId)}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;
