// import { useEffect, useState } from "react"
// import axios from "../../api/axios"
// import { toast } from "sonner"

// export default function AdminDashboard() {

//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [roleChange, setRoleChange] = useState({})
//   const [stats, setStats] = useState({})

//   // Fetch users
//   const fetchUsers = async () => {
//     try {
//       setLoading(true)
//       const res = await axios.get("/admin/users")
//       const res2 = await axios.get("/admin/users")
//       setUsers(res.data)
//       setStats(res2.data.stats)
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to fetch users")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   // Change role
//   const handleRoleChange = async (userId, role) => {
//     try {
//       const res = await axios.patch("/admin/role", { userId, role })
//       toast.success(`Role updated to ${res.data.role}`)
//       fetchUsers()
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Role update failed")
//     }
//   }

//   // Delete user
//   const handleDelete = async (userId) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return

//     try {
//       await axios.delete(`/admin/user/${userId}`)
//       toast.success("User deleted successfully")
//       fetchUsers()
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Delete failed")
//     }
//   }

//   if (loading) return <p className="p-10">Loading...</p>

//   return (
//     <div className="p-10">
//       <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>

//       <table className="min-w-full border border-gray-300">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2 border">Name</th>
//             <th className="p-2 border">Email</th>
//             <th className="p-2 border">Phone</th>
//             <th className="p-2 border">Role</th>
//             <th className="p-2 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(user => (
//             <tr key={user._id} className="text-center">
//               <td className="p-2 border">{user.name}</td>
//               <td className="p-2 border">{user.email}</td>
//               <td className="p-2 border">{user.phone || "-"}</td>
//               <td className="p-2 border">
//                 <select
//                   value={user.role}
//                   onChange={(e) => handleRoleChange(user._id, e.target.value)}
//                   className="border p-1"
//                 >
//                   <option value="student">Student</option>
//                   <option value="supervisor">Supervisor</option>
//                   <option value="evaluator">Evaluator</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </td>
//               <td className="p-2 border">
//                 <button
//                   className="bg-red-500 text-white px-3 py-1 rounded"
//                   onClick={() => handleDelete(user._id)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }




// import { useEffect, useState } from "react";
// import axios from "../../api/axios"
// import { toast } from "sonner";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [stats, setStats] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Fetch data
//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const [usersRes, statsRes] = await Promise.all([
//         axios.get("/admin/users"),
//         axios.get("/admin/stats"),
//       ]);

//       setUsers(usersRes.data);
//       setStats(statsRes.data);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleRoleChange = async (userId, role) => {
//     try {
//       await axios.patch("/admin/role", { userId, role });
//       toast.success("Role updated");
//       fetchData();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Role update failed");
//     }
//   };

//   const handleDelete = async (userId) => {
//     if (!window.confirm("Are you sure?")) return;

//     try {
//       await axios.delete(`/admin/user/${userId}`);
//       toast.success("User deleted");
//       fetchData();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Delete failed");
//     }
//   };

//   if (loading) return <p className="p-10">Loading...</p>;

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 text-white p-5">
//         <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
//         <ul className="space-y-3">
//           <li className="hover:text-blue-400 cursor-pointer">Dashboard</li>
//           <li className="hover:text-blue-400 cursor-pointer">Users</li>
//           <li className="hover:text-blue-400 cursor-pointer">Thesis</li>
//           <li className="hover:text-blue-400 cursor-pointer">Chat</li>
//           <li className="hover:text-blue-400 cursor-pointer">Meetings</li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-blue-500 text-white p-5 rounded shadow">
//             <h2 className="text-xl font-bold">{stats.totalStudents || 0}</h2>
//             <p>Total Students</p>
//           </div>

//           <div className="bg-orange-500 text-white p-5 rounded shadow">
//             <h2 className="text-xl font-bold">{stats.pending || 0}</h2>
//             <p>Pending</p>
//           </div>

//           <div className="bg-green-500 text-white p-5 rounded shadow">
//             <h2 className="text-xl font-bold">{stats.completed || 0}</h2>
//             <p>Completed</p>
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="bg-white p-4 rounded shadow">
//           <h2 className="text-lg font-bold mb-3">Users</h2>

//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border">Name</th>
//                   <th className="p-2 border">Email</th>
//                   <th className="p-2 border">Phone</th>
//                   <th className="p-2 border">Role</th>
//                   <th className="p-2 border">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user._id} className="text-center hover:bg-gray-50">
//                     <td className="p-2 border">{user.name}</td>
//                     <td className="p-2 border">{user.email}</td>
//                     <td className="p-2 border">{user.phone || "-"}</td>

//                     <td className="p-2 border">
//                       <select
//                         value={user.role}
//                         onChange={(e) =>
//                           handleRoleChange(user._id, e.target.value)
//                         }
//                         className="border px-2 py-1 rounded"
//                       >
//                         <option value="student">Student</option>
//                         <option value="supervisor">Supervisor</option>
//                         <option value="evaluator">Evaluator</option>
//                         <option value="admin">Admin</option>
//                       </select>
//                     </td>

//                     <td className="p-2 border">
//                       <button
//                         className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//                         onClick={() => handleDelete(user._id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import ThesisTable from "./ThesisTable";
import axios from "../../api/axios"; 
import { LayoutDashboard,Users,FileText,LogOut,} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [thesis, setThesis] = useState([]);
  const [pending, setPending] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");

  console.log("users", thesis);

  // --- Edit Role Modal States ---
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showModal, setShowModal] = useState(false);

  const openEditModal = (user) => {
    setEditUser(user);
    setNewRole(user.role);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditUser(null);
    setShowModal(false);
  };

  const saveRole = async () => {
    if (!newRole) return toast.error("Role is required");

    try {
      // backend PATCH route: /admin/users/:id
      const res = await axios.patch(`/admin/users/${editUser._id}`, { role: newRole });

      toast.success("Role updated successfully");
      // update local state
      setUsers(users.map((u) => (u._id === editUser._id ? res.data : u)));
      closeModal();
    } catch (err) {
       
     const message = err.response?.data?.message || "Update failed!";
     toast.error(message);
    }
  };

  // --- Fetch data ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes,thesisRes, pendingRes, chartRes,] = await Promise.all([
        axios.get("/admin/users"),
        axios.get("/admin/stats"),
        axios.get("/admin/thesis"),
        axios.get("/admin/pending-thesis"),
        axios.get("/admin/chart"),
      ]);

      setUsers(usersRes.data || []);
      setStats(statsRes.data || {});
      setThesis(thesisRes.data || []);
      setPending(pendingRes.data || []);
      setChartData(chartRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("API error! Check backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Delete user ---
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    axios
      .delete(`/admin/users/${id}`)
      .then(() => {
        toast.success("User deleted");
        setUsers(users.filter((u) => u._id !== id));
      })
      .catch((err) => {
        console.error(err);
        toast.error("Delete failed!");
      });
  };

  //handleDeleteThesis function:
  const handleDeleteThesis = async (thesisId) => {
  if (!confirm("Are you sure you want to delete this thesis?")) return;

  try {
    await axios.delete(`/admin/thesis/${thesisId}`);
    toast.success("Thesis deleted successfully");
    setPending(pending.filter((t) => t._id !== thesisId));
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Delete failed");
  }
};



  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const pieData = [
    { name: "Completed", value: stats.completed || 0 },
    { name: "Pending", value: stats.pending || 0 },
  ];

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  const handleLogout = async () => {
  try {
    await axios.post("/auth/logout"); // call backend logout
    localStorage.removeItem("user");  // remove user info
    window.location.href = "/login";  // redirect to login
  } catch (err) {
    console.error("Logout failed", err);
  }
};


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {/* Sidebar */}
     {/* Sidebar */}
  <div className="w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 shadow-2xl flex flex-col justify-between relative">

    {/* Top Section */}
    <div>
      {/* Title */}
      <h2 className="text-2xl font-bold mb-8 tracking-wide">
        🚀 Admin Panel
      </h2>

      {/* Menu */}
      <ul className="space-y-3">
        <li
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
          ${
            activeTab === "dashboard"
              ? "bg-blue-500 shadow-lg scale-[1.03]"
              : "hover:bg-gray-700 hover:scale-[1.02]"
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </li>

        <li
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
          ${
            activeTab === "users"
              ? "bg-blue-500 shadow-lg scale-[1.03]"
              : "hover:bg-gray-700 hover:scale-[1.02]"
          }`}
        >
          <Users size={20} />
          <span className="font-medium">Users</span>
        </li>

        <li
          onClick={() => setActiveTab("thesis")}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
          ${
            activeTab === "thesis"
              ? "bg-blue-500 shadow-lg scale-[1.03]"
              : "hover:bg-gray-700 hover:scale-[1.02]"
          }`}
        >
          <FileText size={20} />
          <span className="font-medium">Thesis</span>
        </li>
      </ul>
    </div>

    {/*  Bottom Logout */}
    <button
      onClick={() => {handleLogout()}}
      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition p-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03]"
    >
      <LogOut size={18} />
      Logout
    </button>

    {/* Glow Effect */}
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none" />
  </div>

      {/* Main */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">{activeTab}</h1>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold">{stats.totalStudents || 0}</h2>
                <p>Total Students</p>
              </div>
              <div className="bg-orange-500 text-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold">{stats.pending || 0}</h2>
                <p>Pending</p>
              </div>
              <div className="bg-green-500 text-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold">{stats.completed || 0}</h2>
                <p>Completed</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-xl shadow h-80">
                <h2 className="font-bold mb-2">Monthly Submissions</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-4 rounded-xl shadow h-80">
                <h2 className="font-bold mb-2">Completion Rate</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      fill="#3b82f6"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.name === "Completed" ? "#10b981" : "#f97316"}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pending Table */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold mb-4">Pending Evaluations</h2>
              <table className="w-full border-collapse border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border">Student</th>
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 text-center">
                      <td className="p-3 border">{p.student?.name}</td>
                      <td className="p-3 border">{p.title}</td>
                      <td className="p-3 border">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <input
                placeholder="Search user"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg p-2 w-1/3 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{u.name}</td>
                    <td className="p-3 border">{u.email}</td>
                    <td className="p-3 border">{u.phone || "-"}</td>
                    <td className="p-3 border capitalize">{u.role}</td>
                    <td className="p-3 border flex gap-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => openEditModal(u)}
                      >
                        Edit Role
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Role Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                Edit Role for {editUser.name}
              </h2>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="border rounded-lg p-2 w-full mb-4"
              >
                <option value="student">Student</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Admin</option>
                <option value="evaluator">Evaluator</option>
                <option value="third_evaluator">Third Evaluator</option>
              </select>
              <div className="flex justify-end gap-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={saveRole}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Thesis Tab */}
           {activeTab === "thesis" && (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h2 className="text-xl font-bold mb-4">All Thesis</h2>

                  <ThesisTable thesis={thesis} onDelete={handleDeleteThesis} />
                </div>
              )}


      </div>
    </div>
  );
}