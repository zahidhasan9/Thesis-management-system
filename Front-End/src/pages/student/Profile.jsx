import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "../../api/axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  UserCircle2,
  Mail,
  Phone,
  BadgeInfo,
  GraduationCap,
  LayoutDashboard,
  FileUp,
  Pencil,
  CalendarDays,
  StickyNote
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", route: "/student" },
    { name: "Upload Thesis", route: "/upload" },
  ];

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idNo, setIdNo] = useState("");
  const [batch, setBatch] = useState("");
  const [department, setDepartment] = useState("");
  const [section , setSection] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/student/profile");
      setUser(res.data);

      setName(res.data.name || "");
      setEmail(res.data.email || "");
      setPhone(res.data.phone || "");
      setIdNo(res.data.idNo || "");
      setBatch(res.data.batch || "");
      setDepartment(res.data.department || "");
      setSection(res.data.Section || "");
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await axios.patch("/student/profile", {
        name,
        email,
        phone,
        idNo,
        batch,
        department,
        Section:section
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const profileItems = [
    {
      label: "Full Name",
      value: user.name || "Not available",
      icon: <UserCircle2 className="w-4 h-4 text-gray-500" />,
    },
    {
      label: "Student ID",
      value: user.idNo || "Not available",
      icon: <BadgeInfo className="w-4 h-4 text-gray-500" />,
    },
    {
      label: "Phone",
      value: user.phone || "Not available",
      icon: <Phone className="w-4 h-4 text-gray-500" />,
    },
    {
      label: "Email",
      value: user.email || "Not available",
      icon: <Mail className="w-4 h-4 text-gray-500" />,
    },
    {
      label: "Role",
      value: user.role || "Student",
      icon: <GraduationCap className="w-4 h-4 text-gray-500" />,
    },
    {
      label: "Department",
      value: user.department || "Not available",
      icon: <LayoutDashboard className="w-4 h-4 text-gray-500" />,
    },
    {
      label: "Batch",
      value: user.batch || "Not available",
      icon: <CalendarDays className="w-4 h-4 text-gray-500" />,
    },
    {
      label: "Section",
      value: user.Section || "Not available",
      icon: <StickyNote className="w-4 h-4 text-gray-500" />,

    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-8 text-center">
          <div className="w-10 h-10 mx-auto border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-800">Loading profile...</h2>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar items={navItems} portal={"Student Portal"} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Student Portal</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              My Profile
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              View and update your personal account information.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-fit inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile summary */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <UserCircle2 className="w-10 h-10 text-gray-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {user.name || "Student Name"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 break-all">
                    {user.email || "No email available"}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      {user.role || "Student"}
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      ID: {user.idNo || "N/A"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setEditMode(!editMode)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition"
                >
                  <Pencil className="w-4 h-4" />
                  {editMode ? "Close Edit" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Profile details */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-5">
                Personal Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {profileItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.icon}
                      <p className="text-xs text-gray-500">{item.label}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-800 break-all">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info note */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Account Note
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600 leading-7">
                  Keep your email, student ID, and phone number updated so your
                  thesis-related communication stays accurate.
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Edit form */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Update Profile
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                Edit your profile information here.
              </p>

              {editMode ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      disabled
                      value={idNo}
                      onChange={(e) => setIdNo(e.target.value)}
                      placeholder="Enter your student ID"
                      className="w-full bg-gray-200  border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Enter your department"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch
                    </label>
                    <input
                      type="text"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      placeholder="Enter your batch"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section
                    </label>
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      placeholder="Enter your section"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full border bg-gray-200 border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-70"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              ) : (
                <div className="border border-gray-200 rounded-xl bg-gray-50 p-4 text-sm text-gray-600 leading-6">
                  Click <span className="font-medium text-gray-800">Edit Profile</span> to update your information.
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Link
                  to="/student"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </Link>

                <Link
                  to="/upload"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <FileUp className="w-4 h-4" />
                  Upload Thesis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}