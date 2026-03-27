

// import { useEffect, useState } from "react";
// import { toast, Toaster } from "sonner";
// import ThesisTable from "./ThesisTable";
// import axios from "../../api/axios"; 
// import { LayoutDashboard,Users,FileText,LogOut,} from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [stats, setStats] = useState({});
//   const [thesis, setThesis] = useState([]);
//   const [pending, setPending] = useState([]);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [search, setSearch] = useState("");

//   console.log("users", thesis);

//   // --- Edit Role Modal States ---
//   const [editUser, setEditUser] = useState(null);
//   const [newRole, setNewRole] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const openEditModal = (user) => {
//     setEditUser(user);
//     setNewRole(user.role);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setEditUser(null);
//     setShowModal(false);
//   };

//   const saveRole = async () => {
//     if (!newRole) return toast.error("Role is required");

//     try {
//       // backend PATCH route: /admin/users/:id
//       const res = await axios.patch(`/admin/users/${editUser._id}`, { role: newRole });

//       toast.success("Role updated successfully");
//       // update local state
//       setUsers(users.map((u) => (u._id === editUser._id ? res.data : u)));
//       closeModal();
//     } catch (err) {
       
//      const message = err.response?.data?.message || "Update failed!";
//      toast.error(message);
//     }
//   };

//   // --- Fetch data ---
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [usersRes, statsRes,thesisRes, pendingRes, chartRes,] = await Promise.all([
//         axios.get("/admin/users"),
//         axios.get("/admin/stats"),
//         axios.get("/admin/thesis"),
//         axios.get("/admin/pending-thesis"),
//         axios.get("/admin/chart"),
//       ]);

//       setUsers(usersRes.data || []);
//       setStats(statsRes.data || {});
//       setThesis(thesisRes.data || []);
//       setPending(pendingRes.data || []);
//       setChartData(chartRes.data || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("API error! Check backend");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // --- Delete user ---
//   const handleDelete = (id) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;

//     axios
//       .delete(`/admin/users/${id}`)
//       .then(() => {
//         toast.success("User deleted");
//         setUsers(users.filter((u) => u._id !== id));
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Delete failed!");
//       });
//   };

//   //handleDeleteThesis function:
//   const handleDeleteThesis = async (thesisId) => {
//   if (!confirm("Are you sure you want to delete this thesis?")) return;

//   try {
//     await axios.delete(`/admin/thesis/${thesisId}`);
//     toast.success("Thesis deleted successfully");
//     setPending(pending.filter((t) => t._id !== thesisId));
//   } catch (err) {
//     console.error(err);
//     toast.error(err.response?.data?.message || "Delete failed");
//   }
// };



//   const filteredUsers = users.filter(
//     (u) =>
//       u.name?.toLowerCase().includes(search.toLowerCase()) ||
//       u.email?.toLowerCase().includes(search.toLowerCase())
//   );

//   const pieData = [
//     { name: "Completed", value: stats.completed || 0 },
//     { name: "Pending", value: stats.pending || 0 },
//   ];

//   if (loading) return <p className="p-10 text-center">Loading...</p>;

//   const handleLogout = async () => {
//   try {
//     await axios.post("/auth/logout"); // call backend logout
//     localStorage.removeItem("user");  // remove user info
//     window.location.href = "/login";  // redirect to login
//   } catch (err) {
//     console.error("Logout failed", err);
//   }
// };


//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Toaster position="top-right" />
//       {/* Sidebar */}
//      {/* Sidebar */}
//   <div className="w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 shadow-2xl flex flex-col justify-between relative">

//     {/* Top Section */}
//     <div>
//       {/* Title */}
//       <h2 className="text-2xl font-bold mb-8 tracking-wide">
//         🚀 Admin Panel
//       </h2>

//       {/* Menu */}
//       <ul className="space-y-3">
//         <li
//           onClick={() => setActiveTab("dashboard")}
//           className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
//           ${
//             activeTab === "dashboard"
//               ? "bg-blue-500 shadow-lg scale-[1.03]"
//               : "hover:bg-gray-700 hover:scale-[1.02]"
//           }`}
//         >
//           <LayoutDashboard size={20} />
//           <span className="font-medium">Dashboard</span>
//         </li>

//         <li
//           onClick={() => setActiveTab("users")}
//           className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
//           ${
//             activeTab === "users"
//               ? "bg-blue-500 shadow-lg scale-[1.03]"
//               : "hover:bg-gray-700 hover:scale-[1.02]"
//           }`}
//         >
//           <Users size={20} />
//           <span className="font-medium">Users</span>
//         </li>

//         <li
//           onClick={() => setActiveTab("thesis")}
//           className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
//           ${
//             activeTab === "thesis"
//               ? "bg-blue-500 shadow-lg scale-[1.03]"
//               : "hover:bg-gray-700 hover:scale-[1.02]"
//           }`}
//         >
//           <FileText size={20} />
//           <span className="font-medium">Thesis</span>
//         </li>
//       </ul>
//     </div>

//     {/*  Bottom Logout */}
//     <button
//       onClick={() => {handleLogout()}}
//       className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition p-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03]"
//     >
//       <LogOut size={18} />
//       Logout
//     </button>

//     {/* Glow Effect */}
//     <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none" />
//   </div>

//       {/* Main */}
//       <div className="flex-1 p-8">
//         <h1 className="text-3xl font-bold mb-6 capitalize">{activeTab}</h1>

//         {/* Dashboard Tab */}
//         {activeTab === "dashboard" && (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//               <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md">
//                 <h2 className="text-2xl font-bold">{stats.totalStudents || 0}</h2>
//                 <p>Total Students</p>
//               </div>
//               <div className="bg-orange-500 text-white p-6 rounded-xl shadow-md">
//                 <h2 className="text-2xl font-bold">{stats.pending || 0}</h2>
//                 <p>Pending</p>
//               </div>
//               <div className="bg-green-500 text-white p-6 rounded-xl shadow-md">
//                 <h2 className="text-2xl font-bold">{stats.completed || 0}</h2>
//                 <p>Completed</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div className="bg-white p-4 rounded-xl shadow h-80">
//                 <h2 className="font-bold mb-2">Monthly Submissions</h2>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={chartData}>
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="count" fill="#3b82f6" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="bg-white p-4 rounded-xl shadow h-80">
//                 <h2 className="font-bold mb-2">Completion Rate</h2>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={pieData}
//                       dataKey="value"
//                       nameKey="name"
//                       outerRadius={100}
//                       fill="#3b82f6"
//                     >
//                       {pieData.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={entry.name === "Completed" ? "#10b981" : "#f97316"}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Pending Table */}
//             <div className="bg-white p-6 rounded-xl shadow">
//               <h2 className="font-bold mb-4">Pending Evaluations</h2>
//               <table className="w-full border-collapse border">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="p-3 border">Student</th>
//                     <th className="p-3 border">Title</th>
//                     <th className="p-3 border">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pending.map((p) => (
//                     <tr key={p._id} className="hover:bg-gray-50 text-center">
//                       <td className="p-3 border">{p.student?.name}</td>
//                       <td className="p-3 border">{p.title}</td>
//                       <td className="p-3 border">{p.status}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {/* Users Tab */}
//         {activeTab === "users" && (
//           <div className="bg-white p-6 rounded-xl shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <input
//                 placeholder="Search user"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="border rounded-lg p-2 w-1/3 focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-3 border">Name</th>
//                   <th className="p-3 border">Email</th>
//                   <th className="p-3 border">Phone</th>
//                   <th className="p-3 border">Role</th>
//                   <th className="p-3 border">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map((u) => (
//                   <tr key={u._id} className="hover:bg-gray-50">
//                     <td className="p-3 border">{u.name}</td>
//                     <td className="p-3 border">{u.email}</td>
//                     <td className="p-3 border">{u.phone || "-"}</td>
//                     <td className="p-3 border capitalize">{u.role}</td>
//                     <td className="p-3 border flex gap-2">
//                       <button
//                         className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                         onClick={() => openEditModal(u)}
//                       >
//                         Edit Role
//                       </button>
//                       <button
//                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                         onClick={() => handleDelete(u._id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Role Edit Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
//               <h2 className="text-xl font-bold mb-4">
//                 Edit Role for {editUser.name}
//               </h2>
//               <select
//                 value={newRole}
//                 onChange={(e) => setNewRole(e.target.value)}
//                 className="border rounded-lg p-2 w-full mb-4"
//               >
//                 <option value="student">Student</option>
//                 <option value="supervisor">Supervisor</option>
//                 <option value="admin">Admin</option>
//                 <option value="evaluator">Evaluator</option>
//                 <option value="third_evaluator">Third Evaluator</option>
//               </select>
//               <div className="flex justify-end gap-3">
//                 <button
//                   className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                   onClick={saveRole}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Thesis Tab */}
//            {activeTab === "thesis" && (
//                 <div className="bg-white p-6 rounded-xl shadow-lg">
//                   <h2 className="text-xl font-bold mb-4">All Thesis</h2>

//                   <ThesisTable thesis={thesis} onDelete={handleDeleteThesis} />
//                 </div>
//               )}


//       </div>
//     </div>
//   );
// }


// import { useEffect, useMemo, useRef, useState } from "react";
// import { toast, Toaster } from "sonner";
// import ThesisTable from "./ThesisTable";
// import axios from "../../api/axios";
// import {
//   LayoutDashboard,
//   Users,
//   FileText,
//   LogOut,
//   Search,
//   GraduationCap,
//   Clock3,
//   CheckCircle2,
//   UserCog,
//   X,
//   ChevronDown,
//   Download,
//   FileSpreadsheet,
//   FileDown,
//   XCircle,
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   const [users, setUsers] = useState([]);
//   const [stats, setStats] = useState({});
//   const [thesis, setThesis] = useState([]);
//   const [pending, setPending] = useState([]);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboard");

//   const [search, setSearch] = useState("");
//   const [userRoleFilter, setUserRoleFilter] = useState("all");
//   const [thesisStatusFilter, setThesisStatusFilter] = useState("all");

//   const [editUser, setEditUser] = useState(null);
//   const [newRole, setNewRole] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);

//   const currentUser = JSON.parse(localStorage.getItem("user")) || {};

//   const openEditModal = (user) => {
//     setEditUser(user);
//     setNewRole(user.role);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setEditUser(null);
//     setNewRole("");
//     setShowModal(false);
//   };

//   const saveRole = async () => {
//     if (!newRole) return toast.error("Role is required");

//     try {
//       const res = await axios.patch(`/admin/users/${editUser._id}`, {
//         role: newRole,
//       });

//       toast.success("Role updated successfully");
//       setUsers((prev) =>
//         prev.map((u) => (u._id === editUser._id ? res.data : u))
//       );
//       closeModal();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed!");
//     }
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const [usersRes, statsRes, thesisRes, pendingRes, chartRes] =
//         await Promise.all([
//           axios.get("/admin/users"),
//           axios.get("/admin/stats"),
//           axios.get("/admin/thesis"),
//           axios.get("/admin/pending-thesis"),
//           axios.get("/admin/chart"),
//         ]);

//       setUsers(usersRes.data || []);
//       setStats(statsRes.data || {});
//       setThesis(thesisRes.data || []);
//       setPending(pendingRes.data || []);
//       setChartData(chartRes.data || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("API error! Check backend");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowProfileDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);

//   const handleDelete = (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     axios
//       .delete(`/admin/users/${id}`)
//       .then(() => {
//         toast.success("User deleted");
//         setUsers((prev) => prev.filter((u) => u._id !== id));
//       })
//       .catch(() => toast.error("Delete failed!"));
//   };

//   const handleDeleteThesis = async (thesisId) => {
//     if (!window.confirm("Are you sure you want to delete this thesis?")) return;

//     try {
//       await axios.delete(`/admin/thesis/${thesisId}`);
//       toast.success("Thesis deleted successfully");
//       setPending((prev) => prev.filter((t) => t._id !== thesisId));
//       setThesis((prev) => prev.filter((t) => t._id !== thesisId));
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Delete failed");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post("/auth/logout");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     } catch (err) {
//       console.error(err);
//       toast.error("Logout failed");
//     }
//   };

//   const filteredUsers = useMemo(() => {
//     return users.filter((u) => {
//       const matchSearch =
//         u.name?.toLowerCase().includes(search.toLowerCase()) ||
//         u.email?.toLowerCase().includes(search.toLowerCase()) ||
//         u.role?.toLowerCase().includes(search.toLowerCase());

//       const matchRole =
//         userRoleFilter === "all" ? true : u.role === userRoleFilter;

//       return matchSearch && matchRole;
//     });
//   }, [users, search, userRoleFilter]);

//   const filteredThesis = useMemo(() => {
//     return thesis.filter((t) => {
//       if (thesisStatusFilter === "all") return true;
//       return t.status === thesisStatusFilter;
//     });
//   }, [thesis, thesisStatusFilter]);

//   const roleSummary = useMemo(() => {
//     return {
//       admins: users.filter((u) => u.role === "admin").length,
//       supervisors: users.filter((u) => u.role === "supervisor").length,
//       evaluators: users.filter((u) => u.role === "evaluator").length,
//       thirdEvaluators: users.filter((u) => u.role === "third_evaluator").length,
//     };
//   }, [users]);

//   const declinedCount = useMemo(() => {
//     return thesis.filter((t) => t.status === "declined").length;
//   }, [thesis]);

//   const pieData = [
//     { name: "Completed", value: stats.completed || 0 },
//     { name: "Pending", value: stats.pending || 0 },
//     { name: "Declined", value: declinedCount || 0 },
//   ];

//   const exportUsersCSV = () => {
//     const headers = ["Name", "Email", "Phone", "Role"];
//     const rows = filteredUsers.map((u) => [
//       u.name || "",
//       u.email || "",
//       u.phone || "",
//       u.role || "",
//     ]);

//     const csvContent = [headers, ...rows]
//       .map((row) => row.map((cell) => `"${cell}"`).join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "users-report.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const exportThesisCSV = () => {
//     const headers = ["Title", "Student", "Status", "Final Mark", "Created At"];
//     const rows = filteredThesis.map((t) => [
//       t.title || "",
//       t.student?.name || "",
//       t.status || "",
//       t.finalMark ?? "",
//       t.createdAt
//         ? new Date(t.createdAt).toLocaleDateString("en-GB")
//         : "",
//     ]);

//     const csvContent = [headers, ...rows]
//       .map((row) => row.map((cell) => `"${cell}"`).join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "thesis-report.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const exportUsersPDF = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(16);
//     doc.text("Users Report", 14, 15);

//     autoTable(doc, {
//       startY: 22,
//       head: [["Name", "Email", "Phone", "Role"]],
//       body: filteredUsers.map((u) => [
//         u.name || "",
//         u.email || "",
//         u.phone || "",
//         u.role || "",
//       ]),
//     });

//     doc.save("users-report.pdf");
//   };

//   const exportThesisPDF = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(16);
//     doc.text("Thesis Report", 14, 15);

//     autoTable(doc, {
//       startY: 22,
//       head: [["Title", "Student", "Status", "Final Mark", "Created At"]],
//       body: filteredThesis.map((t) => [
//         t.title || "",
//         t.student?.name || "",
//         t.status || "",
//         t.finalMark ?? "",
//         t.createdAt
//           ? new Date(t.createdAt).toLocaleDateString("en-GB")
//           : "",
//       ]),
//     });

//     doc.save("thesis-report.pdf");
//   };

//   const menuItems = [
//     { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
//     { key: "users", label: "Users", icon: Users },
//     { key: "thesis", label: "Thesis", icon: FileText },
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//         <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-8 text-center">
//           <div className="w-10 h-10 mx-auto border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mb-4"></div>
//           <h2 className="text-lg font-semibold text-gray-800">
//             Loading admin dashboard...
//           </h2>
//           <p className="text-sm text-gray-500 mt-2">
//             Please wait while data is being prepared.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       <Toaster position="top-right" />

//       {/* Sidebar */}
//       <aside className="hidden lg:flex w-72 min-h-screen bg-white border-r border-gray-200 flex-col justify-between">
//         <div className="p-6">
//           <div className="mb-8">
//             <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-4">
//               <GraduationCap className="w-6 h-6" />
//             </div>
//             <h2 className="text-xl font-semibold text-gray-900">Admin Portal</h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Thesis Management System
//             </p>
//           </div>

//           <nav className="space-y-2">
//             {menuItems.map((item) => {
//               const Icon = item.icon;
//               const active = activeTab === item.key;

//               return (
//                 <button
//                   key={item.key}
//                   onClick={() => setActiveTab(item.key)}
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
//                     active
//                       ? "bg-gray-900 text-white shadow-sm"
//                       : "text-gray-700 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </button>
//               );
//             })}
//           </nav>
//         </div>

//         <div className="p-6 border-t border-gray-200">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white transition px-4 py-3 rounded-xl"
//           >
//             <LogOut className="w-4 h-4" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 p-4 sm:p-6 lg:p-8">
//         {/* Header */}
//         <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div>
//             <p className="text-sm text-gray-500 mb-1">Administrative Overview</p>
//             <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 capitalize">
//               {activeTab}
//             </h1>
//             <p className="text-sm text-gray-500 mt-2">
//               Manage users, monitor thesis progress, and review system activity.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={fetchData}
//               className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
//             >
//               Refresh Data
//             </button>

//             {/* Admin dropdown */}
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setShowProfileDropdown((prev) => !prev)}
//                 className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//               >
//                 <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
//                   {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
//                 </div>
//                 <div className="hidden sm:block text-left">
//                   <p className="text-sm font-medium text-gray-800">
//                     {currentUser?.name || "Admin"}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {currentUser?.email || "admin@email.com"}
//                   </p>
//                 </div>
//                 <ChevronDown className="w-4 h-4 text-gray-500" />
//               </button>

//               {showProfileDropdown && (
//                 <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
//                   <div className="p-4 border-b border-gray-200">
//                     <p className="text-sm font-semibold text-gray-900">
//                       {currentUser?.name || "Admin"}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {currentUser?.email || "admin@email.com"}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1 capitalize">
//                       Role: {currentUser?.role || "admin"}
//                     </p>
//                   </div>

//                   <button
//                     onClick={() => {
//                       setShowProfileDropdown(false);
//                       handleLogout();
//                     }}
//                     className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Dashboard */}
//         {activeTab === "dashboard" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
//               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-sm text-gray-500">Total Students</span>
//                   <Users className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-gray-900">
//                   {stats.totalStudents || 0}
//                 </h2>
//               </div>

//               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-sm text-gray-500">Pending Thesis</span>
//                   <Clock3 className="w-5 h-5 text-yellow-500" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-yellow-700">
//                   {stats.pending || 0}
//                 </h2>
//               </div>

//               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-sm text-gray-500">Completed</span>
//                   <CheckCircle2 className="w-5 h-5 text-green-500" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-green-700">
//                   {stats.completed || 0}
//                 </h2>
//               </div>

//               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-sm text-gray-500">Declined Thesis</span>
//                   <XCircle className="w-5 h-5 text-red-500" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-red-700">
//                   {declinedCount}
//                 </h2>
//               </div>

//               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-sm text-gray-500">Total Thesis</span>
//                   <FileText className="w-5 h-5 text-blue-500" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-blue-700">
//                   {thesis.length || 0}
//                 </h2>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
//               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
//                 <p className="text-xs text-gray-500 mb-2">Admins</p>
//                 <p className="text-lg font-semibold text-gray-900">
//                   {roleSummary.admins}
//                 </p>
//               </div>
//               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
//                 <p className="text-xs text-gray-500 mb-2">Supervisors</p>
//                 <p className="text-lg font-semibold text-gray-900">
//                   {roleSummary.supervisors}
//                 </p>
//               </div>
//               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
//                 <p className="text-xs text-gray-500 mb-2">Evaluators</p>
//                 <p className="text-lg font-semibold text-gray-900">
//                   {roleSummary.evaluators}
//                 </p>
//               </div>
//               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
//                 <p className="text-xs text-gray-500 mb-2">Third Evaluators</p>
//                 <p className="text-lg font-semibold text-gray-900">
//                   {roleSummary.thirdEvaluators}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 h-[360px]">
//                 <div className="mb-4">
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     Monthly Thesis Submissions
//                   </h2>
//                 </div>

//                 <ResponsiveContainer width="100%" height="85%">
//                   <BarChart data={chartData}>
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#111827" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 h-[360px]">
//                 <div className="mb-4">
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     Thesis Status Overview
//                   </h2>
//                 </div>

//                 <ResponsiveContainer width="100%" height="85%">
//                   <PieChart>
//                     <Pie
//                       data={pieData}
//                       dataKey="value"
//                       nameKey="name"
//                       outerRadius={95}
//                     >
//                       <Cell fill="#16a34a" />
//                       <Cell fill="#f59e0b" />
//                       <Cell fill="#ef4444" />
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Users */}
//         {activeTab === "users" && (
//           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
//             <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   User Management
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Search, filter, export, and manage users
//                 </p>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
//                 <div className="relative w-full sm:w-72">
//                   <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                   <input
//                     placeholder="Search by name, email, or role"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
//                   />
//                 </div>

//                 <select
//                   value={userRoleFilter}
//                   onChange={(e) => setUserRoleFilter(e.target.value)}
//                   className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white"
//                 >
//                   <option value="all">All Roles</option>
//                   <option value="student">Student</option>
//                   <option value="supervisor">Supervisor</option>
//                   <option value="admin">Admin</option>
//                   <option value="evaluator">Evaluator</option>
//                   <option value="third_evaluator">Third Evaluator</option>
//                 </select>

//                 <button
//                   onClick={exportUsersCSV}
//                   className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-sm hover:bg-gray-50"
//                 >
//                   <FileSpreadsheet className="w-4 h-4" />
//                   CSV
//                 </button>

//                 <button
//                   onClick={exportUsersPDF}
//                   className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-black"
//                 >
//                   <FileDown className="w-4 h-4" />
//                   PDF
//                 </button>
//               </div>
//             </div>

//             {filteredUsers.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-50 text-left">
//                       <th className="p-3 border-b text-sm font-semibold text-gray-700">Name</th>
//                       <th className="p-3 border-b text-sm font-semibold text-gray-700">Email</th>
//                       <th className="p-3 border-b text-sm font-semibold text-gray-700">Phone</th>
//                       <th className="p-3 border-b text-sm font-semibold text-gray-700">Role</th>
//                       <th className="p-3 border-b text-sm font-semibold text-gray-700">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredUsers.map((u) => (
//                       <tr key={u._id} className="hover:bg-gray-50 align-top">
//                         <td className="p-3 border-b text-sm text-gray-700">{u.name}</td>
//                         <td className="p-3 border-b text-sm text-gray-700 break-all">{u.email}</td>
//                         <td className="p-3 border-b text-sm text-gray-700">{u.phone || "-"}</td>
//                         <td className="p-3 border-b text-sm text-gray-700 capitalize">{u.role}</td>
//                         <td className="p-3 border-b">
//                           <div className="flex flex-wrap gap-2">
//                             <button
//                               className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-black text-sm"
//                               onClick={() => openEditModal(u)}
//                             >
//                               <UserCog className="w-4 h-4" />
//                               Edit Role
//                             </button>
//                             <button
//                               className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm"
//                               onClick={() => handleDelete(u._id)}
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-sm text-gray-500">
//                 No users matched your search.
//               </div>
//             )}
//           </div>
//         )}

//         {/* Thesis */}
//         {activeTab === "thesis" && (
//           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
//             <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   Thesis Management
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Filter, export, view details, and manage thesis submissions
//                 </p>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
//                 <select
//                   value={thesisStatusFilter}
//                   onChange={(e) => setThesisStatusFilter(e.target.value)}
//                   className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="pending">Pending</option>
//                   <option value="accepted">Accepted</option>
//                   <option value="declined">Declined</option>
//                   <option value="completed">Completed</option>
//                 </select>

//                 <button
//                   onClick={exportThesisCSV}
//                   className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-sm hover:bg-gray-50"
//                 >
//                   <FileSpreadsheet className="w-4 h-4" />
//                   CSV
//                 </button>

//                 <button
//                   onClick={exportThesisPDF}
//                   className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-black"
//                 >
//                   <FileDown className="w-4 h-4" />
//                   PDF
//                 </button>
//               </div>
//             </div>

//             <ThesisTable
//               thesis={filteredThesis}
//               onDelete={handleDeleteThesis}
//               onViewDetails={(id) => navigate(`/admin/thesis/${id}`)}
//             />
//           </div>
//         )}
//       </main>

//       {/* Role Edit Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
//           <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200">
//             <div className="flex items-center justify-between p-5 border-b border-gray-200">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-800">Edit User Role</h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {editUser?.name || "User"}
//                 </p>
//               </div>

//               <button
//                 onClick={closeModal}
//                 className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="p-5">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Role
//               </label>
//               <select
//                 value={newRole}
//                 onChange={(e) => setNewRole(e.target.value)}
//                 className="border border-gray-300 rounded-lg p-3 w-full mb-5 focus:outline-none focus:ring-2 focus:ring-gray-300"
//               >
//                 <option value="student">Student</option>
//                 <option value="supervisor">Supervisor</option>
//                 <option value="admin">Admin</option>
//                 <option value="evaluator">Evaluator</option>
//                 <option value="third_evaluator">Third Evaluator</option>
//               </select>

//               <div className="flex justify-end gap-3">
//                 <button
//                   className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black"
//                   onClick={saveRole}
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





import { useEffect, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminStatsCards from "../../components/admin/AdminStatsCards";
import AdminRoleSummary from "../../components/admin/AdminRoleSummary";
import DashboardCharts from "../../components/admin/DashboardCharts";
import PendingThesisTable from "../../components/admin/PendingThesisTable";
import UsersSection from "../../components/admin/UsersSection";
import ThesisSection from "../../components/admin/ThesisSection";
import EditRoleModal from "../../components/admin/EditRoleModal";

import { exportUsersCSV } from "../../utils/admin/exportUsersCSV";
import { exportUsersPDF } from "../../utils/admin/exportUsersPDF";
import { exportThesisCSV } from "../../utils/admin/exportThesisCSV";
import { exportThesisPDF } from "../../utils/admin/exportThesisPDF";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [thesis, setThesis] = useState([]);
  const [pending, setPending] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [search, setSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [thesisStatusFilter, setThesisStatusFilter] = useState("all");

  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes, thesisRes, pendingRes, chartRes] =
        await Promise.all([
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
      toast.error("API error! Check backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEditModal = (user) => {
    setEditUser(user);
    setNewRole(user.role);
    setShowModal(true);
  };

  const closeModal = () => {
    setEditUser(null);
    setNewRole("");
    setShowModal(false);
  };

  const saveRole = async () => {
    if (!newRole) return toast.error("Role is required");

    try {
      const res = await axios.patch(`/admin/users/${editUser._id}`, {
        role: newRole,
      });

      toast.success("Role updated successfully");
      setUsers((prev) =>
        prev.map((u) => (u._id === editUser._id ? res.data : u))
      );
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Delete failed!");
    }
  };

  const handleDeleteThesis = async (id) => {
    if (!window.confirm("Are you sure you want to delete this thesis?")) return;
    try {
      await axios.delete(`/admin/thesis/${id}`);
      setThesis((prev) => prev.filter((t) => t._id !== id));
      setPending((prev) => prev.filter((t) => t._id !== id));
      toast.success("Thesis deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch {
      toast.error("Logout failed");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.role?.toLowerCase().includes(search.toLowerCase());

      const matchRole =
        userRoleFilter === "all" ? true : u.role === userRoleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, userRoleFilter]);

  const filteredThesis = useMemo(() => {
    return thesis.filter((t) =>
      thesisStatusFilter === "all" ? true : t.status === thesisStatusFilter
    );
  }, [thesis, thesisStatusFilter]);

  const roleSummary = useMemo(() => ({
    admins: users.filter((u) => u.role === "admin").length,
    supervisors: users.filter((u) => u.role === "supervisor").length,
    evaluators: users.filter((u) => u.role === "evaluator").length,
    thirdEvaluators: users.filter((u) => u.role === "third_evaluator").length,
  }), [users]);

  const declinedCount = useMemo(
    () => thesis.filter((t) => t.status === "declined").length,
    [thesis]
  );

  const pieData = [
    { name: "Completed", value: stats.completed || 0 },
    { name: "Pending", value: stats.pending || 0 },
    { name: "Declined", value: declinedCount || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Toaster position="top-right" />

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <AdminHeader
          activeTab={activeTab}
          fetchData={fetchData}
          currentUser={currentUser}
          handleLogout={handleLogout}
          dropdownRef={dropdownRef}
          showProfileDropdown={showProfileDropdown}
          setShowProfileDropdown={setShowProfileDropdown}
        />

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <AdminStatsCards
              stats={stats}
              thesisCount={thesis.length}
              declinedCount={declinedCount}
            />
            <AdminRoleSummary roleSummary={roleSummary} />
            <DashboardCharts chartData={chartData} pieData={pieData} />
            <PendingThesisTable pending={pending} />
          </div>
        )}

        {activeTab === "users" && (
          <UsersSection
            search={search}
            setSearch={setSearch}
            userRoleFilter={userRoleFilter}
            setUserRoleFilter={setUserRoleFilter}
            filteredUsers={filteredUsers}
            openEditModal={openEditModal}
            handleDelete={handleDelete}
            onExportCSV={() => exportUsersCSV(filteredUsers)}
            onExportPDF={() => exportUsersPDF(filteredUsers)}
          />
        )}

        {activeTab === "thesis" && (
          <ThesisSection
            thesisStatusFilter={thesisStatusFilter}
            setThesisStatusFilter={setThesisStatusFilter}
            filteredThesis={filteredThesis}
            handleDeleteThesis={handleDeleteThesis}
            onViewDetails={(id) => navigate(`/admin/thesis/${id}`)}
            onExportCSV={() => exportThesisCSV(filteredThesis)}
            onExportPDF={() => exportThesisPDF(filteredThesis)}
          />
        )}
      </main>

      <EditRoleModal
        showModal={showModal}
        editUser={editUser}
        newRole={newRole}
        setNewRole={setNewRole}
        closeModal={closeModal}
        saveRole={saveRole}
      />
    </div>
  );
}