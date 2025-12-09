import React, { useState, useEffect } from "react";
import MentorSideBar from "./MentorSideBar";
import TopBar from "../AdminPage/TopBar";
import axiosInstance from "../../../instance/axiosInstance";
import Swal from "sweetalert2";
import MentorTopBar from "./MentorTopBar";

function FetchMentor() {
  const [showModal, setShowModal] = useState(false);
  const [editShowModal, setEditShowModal] = useState(false);
  const [ViewShowModal, setViewShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");

  const [selectMentor, setSelectMentor] = useState({});
  const [selectEmail, setSelectEmail] = useState("");
  const [mentor, setMentor] = useState([]);
  const [count, setCount] = useState(0);
  const [viewMentor, setViewMentor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Filtered mentors for search
  const filteredMentors = mentor.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.number?.toString().includes(searchTerm) ||
      m.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch mentors
  const fetchMentor = async () => {
    try {
      const response = await axiosInstance.get("/admin/getMentor");
      setMentor(response.data);
      setCount(response.data.length);
    } catch (error) {
      console.error("Failed to fetch mentor", error);
      alert("Failed to fetch mentor list.");
    }
  };

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

  useEffect(() => {
    fetchMentor();
    fetchCourses();
  }, []);

  // ✅ Send OTP
  const sendOtp = async () => {
    try {
      await axiosInstance.post("/admin/sendOtp", { email });
      setShowOtpModal(true);
      Swal.fire("OTP Sent!", "Check your email for the OTP.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to send OTP", "error");
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async () => {
    try {
      const res = await axiosInstance.post("/admin/verifyOtp", { email, otp });
      if (res.data.success) {
        Swal.fire("Verified!", "Email verified successfully.", "success");
        setShowOtpModal(false);
      } else {
        Swal.fire("Invalid OTP", "Please try again.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "OTP verification failed", "error");
    }
  };

  // Add mentor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/createMentor", {
        name,
        email,
        number,
        password,
        course,
      });

      setShowModal(false);
      setName("");
      setEmail("");
      setNumber("");
      setPassword("");
      setCourse("");

      fetchMentor();

      Swal.fire({
        icon: "success",
        title: "Mentor Added!",
        text: "The mentor has been added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Add Mentor",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  // Toggle Mentor Status
  const toggleMentorStatus = async (id) => {
    try {
      const res = await axiosInstance.put("/admin/toggleMentorStatus", { id });

      setMentor((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, isActive: res.data.mentor.isActive } : m
        )
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `${res.data.mentor.name} is now ${
          res.data.mentor.isActive ? "Active" : "Inactive"
        }`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  // Edit Mentor
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: "Don't Save",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.post("/admin/editMentor", {
          name: selectMentor.name,
          email: selectMentor.email,
          number: selectMentor.number,
          course: selectMentor.course,
          selectEmail,
        });

        setEditShowModal(false);
        await fetchMentor();

        Swal.fire({
          icon: "success",
          title: "Mentor Updated!",
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to Update Mentor",
          text: error.response?.data?.message || "Something went wrong!",
        });
      }
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  };

  const handleEditClick = (mentorToEdit) => {
    setEditShowModal(true);
    setSelectMentor({
      name: mentorToEdit.name,
      email: mentorToEdit.email,
      number: mentorToEdit.Number,
      course: mentorToEdit.course,
    });
    setSelectEmail(mentorToEdit.email);
  };

  const handleViewPassword = (mentorToView) => {
    setViewMentor(mentorToView);
    setShowPassword(true);
  };

  const handleViewClick = (mentorToView) => {
    setViewMentor(mentorToView);
    setViewShowModal(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <MentorSideBar />
      <div className="flex-1 overflow-auto">
        <MentorTopBar />
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Mentors ({count})</h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-600 transition-colors"
            >
              + Add Mentor
            </button>
          </div>

          {/* Search input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search mentors by name, email, phone, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Mentor Table */}
          <div className="bg-white shadow-md rounded-md overflow-x-auto overflow-y-auto max-h-[600px]">
            <table className="min-w-full ">
              <thead className="sticky top-0 bg-gray-100">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">No</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Number</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {filteredMentors.map((m, index) => (
                  <tr key={m._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{m.name}</td>
                    <td className="px-4 py-3">{m.email}</td>
                    <td className="px-4 py-3">{m.Number}</td>
                    <td className="px-4 py-3">{m.course}</td>
                    <td className="px-4 py-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleEditClick(m)}
                        className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleMentorStatus(m._id)}
                        className={`px-2 py-1 text-xs font-semibold rounded-md ${
                          m.isActive
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {m.isActive ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => handleViewPassword(m)}
                        className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default FetchMentor;
