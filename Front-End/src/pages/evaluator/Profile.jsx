import  { useEffect, useState } from "react";
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
  Pencil,
  Building2,
  Briefcase,
  StickyNote,
} from "lucide-react";

export default function EvaluatorProfile() {
  const navigate = useNavigate();

  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const role = userFromStorage?.role;
  const isThirdEvaluator = role === "third_evaluator";
 
  const navItems = [
    { name: "Dashboard", route: "/evaluator/dashboard" },
  ];

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/evaluator/profile");
      const profile = res.data || {};

      setUser(profile);
      setName(profile.name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setEmployeeId(profile.idNo || "");
      setDepartment(profile.department || "");
      setDesignation(profile.designation || "");
      setNote(profile.note || "");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        name,
        phone,
        department,
        designation,
        note,
      };

      const res = await axios.patch("/evaluator/profile", payload);
      const updatedUser = res.data || {};

      setUser(updatedUser);

      const localUser = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...localUser,
          ...updatedUser,
        })
      );

      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const profileItems = [
    {
      label: "Full Name",
      value: user.name || "Not available",
      icon: <UserCircle2 className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "Employee ID",
      value: user.idNo || "Not available",
      icon: <BadgeInfo className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "Phone",
      value: user.phone || "Not available",
      icon: <Phone className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "Email",
      value: user.email || "Not available",
      icon: <Mail className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "Role",
      value: isThirdEvaluator ? "Third Evaluator" : user.role || "Evaluator",
      icon: <GraduationCap className="h-4 w-4 text-gray-500" />,
    },
    {
      label: "Department",
      value: user.department || "Not available",
      icon: <Building2 className="h-4 w-4 text-gray-500" />,
    },
    // {
    //   label: "Designation",
    //   value: user.designation || "Not available",
    //   icon: <Briefcase className="h-4 w-4 text-gray-500" />,
    // },
    {
      label: "Note",
      value: user.note || "Not available",
      icon: <StickyNote className="h-4 w-4 text-gray-500" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white px-8 py-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700"></div>
          <h2 className="text-lg font-semibold text-gray-800">
            Loading profile...
          </h2>
          <p className="mt-2 text-sm text-gray-500">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        items={navItems}
        portal={isThirdEvaluator ? "Third Evaluator Portal" : "Evaluator Portal"}
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm text-gray-500">
              {isThirdEvaluator ? "Third Evaluator Portal" : "Evaluator Portal"}
            </p>
            <h1 className="text-2xl font-semibold text-gray-800 sm:text-3xl">
              My Profile
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              View and update your evaluator account information.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
                  <UserCircle2 className="h-10 w-10 text-gray-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {user.name || "Evaluator Name"}
                  </h2>
                  <p className="mt-1 break-all text-sm text-gray-500">
                    {user.email || "No email available"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs text-gray-700">
                      {isThirdEvaluator ? "Third Evaluator" : "Evaluator"}
                    </span>
                    <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs text-gray-700">
                      Employee ID: {user.idNo || "N/A"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setEditMode(!editMode)}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-white transition hover:bg-black"
                >
                  <Pencil className="h-4 w-4" />
                  {editMode ? "Close Edit" : "Edit Profile"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-semibold text-gray-800">
                Professional Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {profileItems.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      {item.icon}
                      <p className="text-xs text-gray-500">{item.label}</p>
                    </div>
                    <p className="break-all text-sm font-medium text-gray-800">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Account Note
              </h3>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm leading-7 text-gray-600">
                  Keep your phone number, department, and designation updated so
                  evaluation workflow and academic communication remain accurate.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                Update Profile
              </h3>
              <p className="mb-5 text-sm text-gray-500">
                Edit your evaluator profile information here.
              </p>

              {editMode ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={employeeId}
                      disabled
                      placeholder="Employee ID"
                      className="w-full rounded-lg border border-gray-300 bg-gray-200 px-3 py-2.5 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Enter your department"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  {/* <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="Enter your designation"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div> */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-gray-300 bg-gray-200 px-3 py-2.5 text-sm focus:outline-none"
                    />
                  </div>

                  {/* <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Note
                    </label>
                    <textarea
                      rows={4}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a short professional note"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                  </div> */}

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-70"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                  Click{" "}
                  <span className="font-medium text-gray-800">Edit Profile</span>{" "}
                  to update your information.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Link
                  to="/evaluator/dashboard"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-white transition hover:bg-black"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}