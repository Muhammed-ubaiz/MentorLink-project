import React, { useState, useEffect } from "react";
import Sidebar from "../AdminPage/Sidebar";
import TopBar from "../AdminPage/TopBar";
import axiosInstance from "../../../instance/axiosInstance";
import Swal from "sweetalert2";

function Mentor() {
  // ---------- State ----------
  const [showModal, setShowModal] = useState(false);
  const [editShowModal, setEditShowModal] = useState(false);
  const [viewShowModal, setViewShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [mentorList, setMentorList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedMentor, setSelectedMentor] = useState({});
  const [selectedEmail, setSelectedEmail] = useState("");
  const [viewMentor, setViewMentor] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // ---------- Fetch Data ----------
  const fetchMentors = async () => {
    try {
      const res = await axiosInstance.get("/admin/getMentor");
      setMentorList(res.data);
      setCount(res.data.length);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch mentors", "error");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/admin/getCourse");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMentors();
    fetchCourses();
  }, []);

  // ---------- Create Mentor ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      return Swal.fire("Warning", "Please verify email first!", "warning");
    }

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
      setIsEmailVerified(false);
      fetchMentors();

      Swal.fire("Success", "Mentor added successfully!", "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to add mentor", "error");
    }
  };

  // ---------- OTP ----------
  const sendOtp = async () => {
    try {
      Swal.fire({
        title: "Sending OTP...",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
      });

      const res = await axiosInstance.post("/admin/send-otp", { email });
      Swal.close();

      if (res.data.success) {
        setShowOtpModal(true);
        Swal.fire("Success", "OTP sent! Check your email.", "success");
      } else {
        Swal.fire("Error", "Failed to send OTP", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong while sending OTP", "error");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axiosInstance.post("/admin/verify-otp", { email, otp });
      if (res.data.success) {
        setIsEmailVerified(true);
        setShowOtpModal(false);
        Swal.fire("Success", "Email verified successfully!", "success");
      } else {
        Swal.fire("Error", "Invalid OTP. Try again.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Verification failed", "error");
    }
  };

  // ---------- Edit Mentor ----------
  const handleEditClick = (mentor) => {
    setEditShowModal(true);
    setSelectedMentor({
      _id: mentor._id,
      name: mentor.name,
      email: mentor.email,
      number: mentor.Number,
      course: mentor.course,
    });
    setSelectedEmail(mentor.email);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const confirm = await Swal.fire({
      title: "Save changes?",
      showCancelButton: true,
      confirmButtonText: "Save",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosInstance.post("/admin/editMentor", {
          ...selectedMentor,
          selectEmail: selectedEmail,
        });
        setEditShowModal(false);
        fetchMentors();
        Swal.fire("Updated!", res.data.message || "Mentor updated successfully", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to update mentor", "error");
      }
    }
  };

  // ---------- Toggle Mentor Status ----------
  const toggleMentorStatus = async (id) => {
    try {
      const res = await axiosInstance.put("/admin/toggleMentorStatus", { id });
      setMentorList((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isActive: res.data.mentor.isActive } : m))
      );
      Swal.fire("Success", "Status updated!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // ---------- View ----------
  const handleViewPassword = (m) => {
    setViewMentor(m);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setViewShowModal(true);
    setShowPasswordModal(false);
  };

  const filteredMentors = mentorList.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.Number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------- JSX ----------
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Mentors ({count})</h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition"
            >
              + Add Mentor
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 border border-gray-300 rounded-md px-4 py-2 mb-4 shadow-sm focus:ring-2 focus:ring-indigo-400"
          />

          {/* Table */}
          <div className="bg-white shadow-md rounded-md overflow-x-auto overflow-y-auto max-h-[600px]">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Number</th>
                  <th className="px-4 py-2 text-left">Course</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMentors.map((m, i) => (
                  <tr key={m._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{m.name}</td>
                    <td className="px-4 py-2">{m.email}</td>
                    <td className="px-4 py-2">{m.Number}</td>
                    <td className="px-4 py-2">{m.course}</td>
                    <td className="px-4 py-2 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEditClick(m)}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleMentorStatus(m._id)}
                        className={`px-2 py-1 rounded ${
                          m.isActive
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {m.isActive ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => handleViewPassword(m)}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
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

      {/* Create Mentor Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-white/50 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 relative animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">
        Create New Mentor
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mentor Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter mentor name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>

        {/* Email + Verify */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={sendOtp}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Verify
            </button>
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter phone number"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>

        {/* Course */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course
          </label>
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c.newCourse}>
                {c.newCourse}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Create Mentor
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* ✅ Edit Mentor Modal */}
      {editShowModal && (
        <Modal onClose={() => setEditShowModal(false)} title="Edit Mentor">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Name"
              value={selectedMentor.name || ""}
              setValue={(val) => setSelectedMentor({ ...selectedMentor, name: val })}
            />
            <Input
              label="Email"
              value={selectedMentor.email || ""}
              setValue={(val) => setSelectedMentor({ ...selectedMentor, email: val })}
              type="email"
            />
            <Input
              label="Phone Number"
              value={selectedMentor.number || ""}
              setValue={(val) => setSelectedMentor({ ...selectedMentor, number: val })}
            />
            <div>
              <label className="block text-sm font-medium">Course</label>
              <select
                value={selectedMentor.course || ""}
                onChange={(e) =>
                  setSelectedMentor({ ...selectedMentor, course: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 mt-1"
              >
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c._id} value={c.newCourse}>
                    {c.newCourse}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </Modal>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <Modal onClose={() => setShowOtpModal(false)} title="Enter OTP">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mb-4"
            placeholder="Enter OTP"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowOtpModal(false)} className="border px-4 py-2 rounded-md">
              Cancel
            </button>
            <button onClick={verifyOtp} className="bg-green-600 text-white px-4 py-2 rounded-md">
              Verify
            </button>
          </div>
        </Modal>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)} title="Enter Password">
          <form onSubmit={handlePasswordSubmit}>
            <Input
              label="Password"
              value={password}
              setValue={setPassword}
              type="password"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-3"
            >
              OK
            </button>
          </form>
        </Modal>
      )}

      {/* View Mentor Modal */}
      {viewShowModal && viewMentor && (
        <Modal onClose={() => setViewShowModal(false)} title={`${viewMentor.name}'s Details`}>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> {viewMentor.email}
            </p>
            <p>
              <strong>Phone:</strong> {viewMentor.Number}
            </p>
            <p>
              <strong>Course:</strong> {viewMentor.course}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {viewMentor.isActive ? (
                <span className="text-green-600 font-semibold">Active</span>
              ) : (
                <span className="text-red-600 font-semibold">Inactive</span>
              )}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------- Reusable Components ----------
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
      {children}
    </div>
  </div>
);

const Input = ({ label, value, setValue, type = "text", required = true }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
      required={required}
    />
  </div>
);

export default Mentor;
