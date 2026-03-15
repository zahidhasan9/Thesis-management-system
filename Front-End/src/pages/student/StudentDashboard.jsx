// import { useEffect, useState } from "react";
// import axios from "../../api/axios";

// export default function StudentDashboard() {
//   const [thesis, setThesis] = useState([]);
//   console.log("thesis", thesis);

//   useEffect(() => {
//     axios.get("/student/my-thesis")
//       .then(res => setThesis(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   const getStatusColor = (status) => {
//     switch(status) {
//       case "pending": return "bg-yellow-100 text-yellow-800";
//       case "approved": return "bg-green-100 text-green-800";
//       case "rejected": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">My Thesis</h1>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {thesis?.length > 0 ? (
//           thesis.map(t => (
//             <div
//               key={t._id}
//               className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
//             >
//               <h2 className="text-xl font-semibold mb-2 text-gray-900">{t.title || "Title not available"}</h2>

//               <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getStatusColor(t.status)}`}>
//                 {t.status || "Status not available"}
//               </p>

//               <a
//                 href={`http://localhost:5000/${t.pdf}`}
//                 target="_blank"
//                 className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
//               >
//                 View PDF
//               </a>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 col-span-full">No thesis uploaded yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "sonner";
import {
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"; // ✅ lucide-react icons

export default function StudentDashboard() {
  const [thesis, setThesis] = useState([]);
console.log("thesis", thesis);
  useEffect(() => {
    axios
      .get("/student/my-thesis")
      .then((res) => setThesis(res.data))
      .catch(() => toast.error("Failed to load thesis list"));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4" /> Pending
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
            <XCircle className="w-4 h-4" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const handleDelete = (id, status) => {
    if (status === "approved") {
      toast.error("Cannot delete approved thesis!");
      return;
    }

    axios
      .delete(`/student/thesis/${id}`)
      .then(() => {
        setThesis(thesis.filter((t) => t._id !== id));
        toast.success("Thesis deleted successfully!");
      })
      .catch(() => toast.error("Failed to delete thesis"));
  };

  
  const navItems = [
    // { name: "Dashboard", route: "/dashboard" },
    { name: "Upload Thesis", route: "/upload" },
    { name: "Profile", route: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar items={navItems} portal={'Student Portal'}/>
      <Toaster position="top-right" />

      <div className="p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Thesis</h1>

        {thesis?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {thesis.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">
                    {t.title || "Title not available"}
                  </h2>
                  {getStatusBadge(t.status)}
                </div>

                <div className="flex items-center justify-between mt-auto gap-2">
                  <a
                    href={`http://localhost:5000/${t.pdf}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FileText className="w-5 h-5" /> View PDF
                  </a>

                  <button
                    onClick={() => handleDelete(t._id, t.status)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 ${
                      t.status === "accepted"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    disabled={t.status === "accepted"}
                  >
                    <Trash2 className="w-5 h-5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg mt-10 text-center">
            No thesis uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}