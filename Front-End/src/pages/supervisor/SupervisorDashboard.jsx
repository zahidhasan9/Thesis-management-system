


// import { useEffect, useState } from "react";
// import Navbar from "../../components/Navbar";
// import axios from "../../api/axios";
// import { toast } from "sonner";

// export default function SupervisorDashboard() {

//   const [thesis, setThesis] = useState([]);
//   const [selectedThesis, setSelectedThesis] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchThesis = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/supervisor/thesis");
//       setThesis(res.data);
//     } catch (err) {
//       toast.error("Failed to load thesis"+err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchThesis();
//   }, []);

//   const reviewThesis = async (id, status) => {
//     try {

//       await axios.patch("/supervisor/review", {
//         thesisId: id,
//         status: status,
//         note: "Reviewed by supervisor"
//       });

//       toast.success("Thesis updated");

//       fetchThesis();

//     } catch (err) {

//       toast.error("Failed to update thesis");

//     }
//   };

//   const navItems = [
//     // { name: "Dashboard", route: "/dashboard" },
//     { name: "Upload Thesis", route: "/upload" },
//     { name: "Profile", route: "/profile" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100">
//  <Navbar items={navItems} portal={'Supervisor Thesis Review'}/>
//       <h1 className="text-2xl font-bold mb-6">
//         Supervisor Thesis Review
//       </h1>

//       {loading && <p>Loading thesis...</p>}

//       {!loading && thesis.length === 0 && (
//         <p>No thesis submitted yet</p>
//       )}

//       {!loading && thesis.map((t) => (

//         <div
//           key={t._id}
//           className="border rounded-lg p-5 mb-4 shadow"
//         >

//           <h2 className="text-lg font-semibold">
//             {t.title}
//           </h2>

//           <p className="text-gray-600">
//             Student: {t.student?.name}
//           </p>

//           <p className="text-sm mt-1">
//             Status: <span className="font-medium">{t.status}</span>
//           </p>

//           <div className="flex gap-2 mt-4">

//             <button
//               onClick={() => setSelectedThesis(t)}
//               className="bg-blue-500 text-white px-3 py-1 rounded"
//             >
//               View
//             </button>

//             <button
//               onClick={() => reviewThesis(t._id, "accepted")}
//               className="bg-green-500 text-white px-3 py-1 rounded"
//             >
//               Accept
//             </button>

//             <button
//               onClick={() => reviewThesis(t._id, "rejected")}
//               className="bg-red-500 text-white px-3 py-1 rounded"
//             >
//               Reject
//             </button>

//           </div>

//         </div>

//       ))}

//       {/* Thesis Details Modal */}

//       {selectedThesis && (

//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

//           <div className="bg-white rounded-lg p-6 w-[500px]">

//             <h2 className="text-xl font-bold mb-3">
//               {selectedThesis.title}
//             </h2>

//             <p>
//               <b>Student:</b> {selectedThesis.student?.name}
//             </p>

//             <p className="mt-3">
//               {selectedThesis.description}
//             </p>

//             <div className="mt-5 flex justify-end">

//               <button
//                 onClick={() => setSelectedThesis(null)}
//                 className="bg-gray-500 text-white px-4 py-2 rounded"
//               >
//                 Close
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";
import { ResponsiveContainer } from "recharts";

export default function SupervisorDashboard() {
  const [thesis, setThesis] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    fetchThesis();
  }, []);

  const fetchThesis = async () => {
    try {
      const res = await axios.get("/supervisor/thesis");
      setThesis(res.data);
    } catch (err) {
      toast.error("Failed to load thesis");
    }
  };
console.log("thesis", thesis);
  // Stats
  const total = thesis.length;
  const pending = thesis.filter(t => t.status === "pending").length;
  const approved = thesis.filter(t => t.status === "accepted").length;
  const rejected = thesis.filter(t => t.status === "declined").length;

  const reviewed = approved + rejected;
  const progress = total ? (reviewed / total) * 100 : 0;

  // Filter
  const filtered = thesis.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" || t.status === filter)
  );

  const chartData = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
  ];

 const navItems = [
    // { name: "Dashboard", route: "/dashboard" },
    // { name: "Upload Thesis", route: "/upload" },
    { name: "Profile", route: "/supervisor/profile" },
  ];
  return (
    <>
     <Navbar items={navItems} portal={'Supervisor Portal'}/>

    <div className="p-10 bg-gray-100 min-h-screen">
    
      {/* 🔥 Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Total" value={total} />
        <Card title="Pending" value={pending} />
        <Card title="Approved" value={approved} />
        <Card title="Rejected" value={rejected} />
      </div>

      {/* 🔥 Progress */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-2">Progress</h2>
        <div className="w-full bg-gray-200 rounded">
          <div
            className="bg-blue-600 text-white text-center"
            style={{ width: `${progress}%` }}
          >
            {progress.toFixed(0)}%
          </div>
        </div>
      </div>

      

      {/* 🔥 Chart */}
      <div className="bg-white p-4 mb-8 rounded-xl shadow">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
     </div>




     {/* 🔥 Search + Filter */}
      <div className="flex gap-4 mb-4">
        <input
          className="p-2 border rounded w-1/2"
          placeholder="Search thesis..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 border rounded"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* 🔥 Table */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr className="text-left">
                <th className="p-3">Student</th>
                <th className="p-3">Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
          <tbody>
            
      {filtered.map((t, index) => (
        <tr
          key={t._id}
          className={`border-b hover:bg-gray-50 ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <td className="p-3">{t.student?.name}</td>
          <td className="p-3">{t.title}</td>

          {/* 🔥 Status Badge */}
          <td className="p-3">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                t.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : t.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {t.status}
            </span>
          </td>

          <td className="p-3">
            <button
              onClick={() => navigate(`/review/${t._id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
            >
              Review
            </button>
            {/* <button
                onClick={() => navigate(`/thesis/view/${t._id}`)}
                className="bg-purple-600 text-white px-3 py-1 rounded"
              >
                View
              </button> */}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    </div>
    </>
  );
}

// 🔥 Card Component
function Card({ title, value }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow-lg hover:scale-105 transition">
      <h2 className="text-sm opacity-80">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}