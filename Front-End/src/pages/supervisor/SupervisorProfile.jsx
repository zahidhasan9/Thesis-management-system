import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "sonner";

export default function SupervisorProfile() {
  const [supervisor, setSupervisor] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Form state
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
      const res = await axios.get("/supervisor/profile"); // API for logged in supervisor
      setSupervisor(res.data);

      // pre-fill form
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
      const res = await axios.patch("/supervisor/profile", {
        name,
        email,
        department,
        phone,
        bio,
      });
      setSupervisor(res.data);
      toast.success("Profile updated");
      setEditMode(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-6 mb-6">
        <img
          src={supervisor.avatar || "https://i.pravatar.cc/150?img=3"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-blue-500"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{supervisor.name}</h1>
          <p className="text-gray-500">{supervisor.department || "Department not set"}</p>
          <p className="text-gray-500">{supervisor.role || "Supervisor"}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Info</h2>
          <div className="flex flex-col gap-2">
            <p><span className="font-semibold text-gray-700">Email:</span> {supervisor.email}</p>
            <p><span className="font-semibold text-gray-700">Phone:</span> {supervisor.phone || "Not set"}</p>
            <p><span className="font-semibold text-gray-700">Department:</span> {supervisor.department || "Not set"}</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bio / About</h2>
          <p className="text-gray-600 leading-relaxed">{supervisor.bio || "No bio available"}</p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {editMode ? "Close" : "Edit"}
          </button>
        </div>

        {editMode && (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            <textarea
              placeholder="Bio / About"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />

            <button
              type="submit"
              className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium shadow"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}