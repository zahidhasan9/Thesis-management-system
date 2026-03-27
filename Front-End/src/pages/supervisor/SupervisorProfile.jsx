import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "sonner";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SupervisorProfile() {
  const navigate = useNavigate();

  const [supervisor, setSupervisor] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    fetchSupervisor();
  }, []);

  const fetchSupervisor = async () => {
    try {
      const res = await axios.get("/supervisor/profile");
      setSupervisor(res.data);

      setName(res.data.name || "");
      setEmail(res.data.email || "");
      setDepartment(res.data.department || "");
      setPhone(res.data.phone || "");
      setBio(res.data.bio || "");
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

      const res = await axios.patch("/supervisor/profile", {
        name,
        email,
        department,
        phone,
        bio,
      });

      setSupervisor(res.data);
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

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
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Supervisor Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your personal and professional information
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-fit px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            ← Back
          </button>
        </div>

        {/* Profile Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-24 h-24 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {supervisor.avatar ? (
                        <img
                          src={supervisor.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        ) : (
                        <User className="w-10 h-10 text-gray-500" />
                            )}
                 </div>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">
                {supervisor.name || "Supervisor Name"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {supervisor.role || "Supervisor"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  {supervisor.department || "Department not set"}
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  {supervisor.email || "Email not set"}
                </span>
              </div>
            </div>

            <div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition shadow-sm"
              >
                {editMode ? "Close Edit" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Contact Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition">
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {supervisor.name || "Not set"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition">
                  <p className="text-xs text-gray-500 mb-1">Email Address</p>
                  <p className="text-sm font-medium text-gray-800 break-all">
                    {supervisor.email || "Not set"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition">
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <p className="text-sm font-medium text-gray-800">
                    {supervisor.phone || "Not set"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition">
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="text-sm font-medium text-gray-800">
                    {supervisor.department || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bio / About
              </h3>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[150px]">
                <p className="text-sm text-gray-700 leading-7 whitespace-pre-line">
                  {supervisor.bio || "No bio available."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Edit Form */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-fit lg:sticky lg:top-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Update Profile
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Edit your profile information here
              </p>
            </div>

            {editMode ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-100 border cursor-not-allowed border-gray-300 rounded-lg px-3 py-2.5 text-sm  focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    placeholder="Write something about yourself"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 min-h-[120px] text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-70 shadow-sm"
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
        </div>
      </div>
    </div>
  );
}