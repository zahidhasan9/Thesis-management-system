// import { useEffect, useState } from "react";
// import axios from "../../api/axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// export default function ReviewPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [thesis, setThesis] = useState({});
//   const [status, setStatus] = useState("");
//   const [note, setNote] = useState("");
//   const [loading, setLoading] = useState(false);

//   const baseURL = "http://localhost:5000"; // backend URL

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`/supervisor/thesis/${id}`);
//       setThesis(res.data);
//     } catch {
//       toast.error("Failed to load thesis");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!status) return toast.error("Please select status");

//     try {
//       await axios.patch("/supervisor/review", {
//         thesisId: id,
//         status,
//         note,
//       });
//       toast.success("Review submitted");
//       navigate("/supervisor");
//     } catch {
//       toast.error("Failed to submit");
//     }
//   };

//   if (loading) {
//     return <p className="text-center mt-10 text-gray-500">Loading...</p>;
//   }

//   // 🔹 Full PDF URL
//   const pdfUrl = thesis.pdf ? `${baseURL}/${thesis.pdf.replace(/\\/g, "/")}` : null;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Review Thesis</h1>
//         <button
//           onClick={() => navigate(-1)}
//           className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//         >
//           ← Back
//         </button>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">

//         {/* 🔹 Thesis Info */}
//         <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 flex flex-col">
//           <h2 className="text-2xl font-bold mb-2 text-gray-900">{thesis.title}</h2>

//           {/* Status Badge */}
//           <span
//             className={`inline-block px-3 py-1 text-xs rounded-full mb-4 font-semibold ${
//               thesis.status === "approved"
//                 ? "bg-green-100 text-green-800"
//                 : thesis.status === "pending"
//                 ? "bg-yellow-100 text-yellow-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             {thesis.status?.toUpperCase()}
//           </span>

//           <p className="text-gray-600 mb-4 leading-relaxed">{thesis.description}</p>

//           {/* Student Info */}
//           {thesis.student && (
//             <div className="mb-4">
//               <p className="font-semibold text-gray-700">Student</p>
//               <p className="text-gray-600">{thesis.student.name} ({thesis.student.email})</p>
//             </div>
//           )}

//           {/* PDF Button */}
//           {pdfUrl ? (
//             <a
//               href={pdfUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-block bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition font-medium text-center shadow-lg"
//             >
//               📄 View PDF
//             </a>
//           ) : (
//             <p className="text-gray-500">No PDF available</p>
//           )}
//         </div>

//         {/* 🔹 Review Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 flex flex-col"
//         >
//           <h2 className="text-xl font-semibold mb-6 text-gray-900">Submit Evaluation</h2>

//           {/* Status */}
//           <label className="text-sm font-medium mb-1 text-gray-700">Select Status</label>
//           <select
//             className="p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
//             onChange={(e) => setStatus(e.target.value)}
//             value={status}
//           >
//             <option value="">Choose...</option>
//             <option value="approved">Approve</option>
//             <option value="rejected">Reject</option>
//             <option value="revision">Revision</option>
//           </select>

//           {/* Feedback */}
//           <label className="text-sm font-medium mb-1 text-gray-700">Feedback</label>
//           <textarea
//             className="p-3 border rounded-lg mb-6 h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
//             placeholder="Write detailed feedback..."
//             onChange={(e) => setNote(e.target.value)}
//             value={note}
//           />

//           {/* Buttons */}
//           <div className="mt-auto flex gap-3">
//             <button
//               type="submit"
//               className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium shadow"
//             >
//               Submit Review
//             </button>

//             <button
//               type="button"
//               onClick={() => navigate("/supervisor")}
//               className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>

//       </div>
//     </div>
//   );
// }







import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [thesis, setThesis] = useState({});
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const baseURL = "http://localhost:5000"; // backend URL

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/supervisor/thesis/${id}`);
      setThesis(res.data);

      // 🔹 Set previous feedback automatically
      if (res.data.supervisorNote) {
        setNote(res.data.supervisorNote);  // previous note prefilled
      }

      if (res.data.status) {
        setStatus(res.data.status);       // previous status prefilled
      }
    } catch {
      toast.error("Failed to load thesis");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status) return toast.error("Please select status");

    try {
      await axios.patch("/supervisor/review", {
        thesisId: id,
        status,
        note,
      });
      toast.success("Review submitted");
      navigate("/supervisor");
    } catch {
      toast.error("Failed to submit");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  // 🔹 Full PDF URL
  const pdfUrl = thesis.pdf ? `${baseURL}/${thesis.pdf.replace(/\\/g, "/")}` : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Review Thesis</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* 🔹 Thesis Info */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 flex flex-col">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">{thesis.title}</h2>

          {/* Status Badge */}
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full mb-4 font-semibold ${
              thesis.status === "accepted"
                ? "bg-green-100 text-green-800"
                : thesis.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                :thesis.status === "completed"
                ?"bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {thesis.status?.toUpperCase()}
          </span>

          <p className="text-gray-600 mb-4 leading-relaxed">{thesis.description}</p>

          {/* Student Info */}
          {thesis.student && (
            <div className="mb-4">
              <p className="font-semibold text-gray-700">Student</p>
              <p className="text-gray-600">{thesis.student.name} ({thesis.student.email})</p>
            </div>
          )}

          {/* PDF Button */}
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition font-medium text-center shadow-lg"
            >
              📄 View PDF
            </a>
          ) : (
            <p className="text-gray-500">No PDF available</p>
          )}
        </div>

        {/* 🔹 Review Form */}
       <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 flex flex-col"
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Submit Evaluation</h2>

      {/* Status */}
      <label className="text-sm font-medium mb-1 text-gray-700">Select Status</label>
      <select
        className="p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        onChange={(e) => setStatus(e.target.value)}
        value={status} // 🔹 Controlled input, previous status retained
      >
        <option value="">Choose...</option>
        <option value="accepted">Approve</option>
        <option value="declined">Reject</option>
        {/* <option value="completed">Completed</option> */}
        <option value="pending">Pending</option>

      </select>

      {/* Feedback */}
      <label className="text-sm font-medium mb-1 text-gray-700">Feedback</label>
      <textarea
        className="p-3 border rounded-lg mb-6 h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        placeholder="Write detailed feedback..."
        onChange={(e) => setNote(e.target.value)}
        value={note} // 🔹 Controlled input, previous note prefilled
      />

      {/* Buttons */}
      <div className="mt-auto flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium shadow"
        >
          Submit Review
        </button>

        <button
          type="button"
          onClick={() => navigate("/supervisor")}
          className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
        >
          Cancel
        </button>
      </div>
    </form>

      </div>
    </div>
  );
}