
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

//       // 🔹 Set previous feedback automatically
//       if (res.data.supervisorNote) {
//         setNote(res.data.supervisorNote);  // previous note prefilled
//       }

//       if (res.data.status) {
//         setStatus(res.data.status);       // previous status prefilled
//       }
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

//   if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

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
//               thesis.status === "accepted"
//                 ? "bg-green-100 text-green-800"
//                 : thesis.status === "pending"
//                 ? "bg-yellow-100 text-yellow-800"
//                 :thesis.status === "completed"
//                 ?"bg-green-100 text-green-800"
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
//        <form
//       onSubmit={handleSubmit}
//       className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 flex flex-col"
//     >
//       <h2 className="text-xl font-semibold mb-6 text-gray-900">Submit Evaluation</h2>

//       {/* Status */}
//       <label className="text-sm font-medium mb-1 text-gray-700">Select Status</label>
//       <select
//         className="p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
//         onChange={(e) => setStatus(e.target.value)}
//         value={status} // 🔹 Controlled input, previous status retained
//       >
//         <option value="">Choose...</option>
//         <option value="accepted">Approve</option>
//         <option value="declined">Reject</option>
//         {/* <option value="completed">Completed</option> */}
//         <option value="pending">Pending</option>

//       </select>

//       {/* Feedback */}
//       <label className="text-sm font-medium mb-1 text-gray-700">Feedback</label>
//       <textarea
//         className="p-3 border rounded-lg mb-6 h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
//         placeholder="Write detailed feedback..."
//         onChange={(e) => setNote(e.target.value)}
//         value={note} // 🔹 Controlled input, previous note prefilled
//       />

//       {/* Buttons */}
//       <div className="mt-auto flex gap-3">
//         <button
//           type="submit"
//           className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium shadow"
//         >
//           Submit Review
//         </button>

//         <button
//           type="button"
//           onClick={() => navigate("/supervisor")}
//           className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>

//       </div>
//     </div>
//   );
// }




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
//   const [submitting, setSubmitting] = useState(false);

//   const baseURL = "http://localhost:5000";

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`/supervisor/thesis/${id}`);
//       setThesis(res.data);

//       if (res.data.supervisorNote) setNote(res.data.supervisorNote);
//       if (res.data.status) setStatus(res.data.status);
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
//       setSubmitting(true);
//       await axios.patch("/supervisor/review", {
//         thesisId: id,
//         status,
//         note,
//       });
//       toast.success("Review submitted successfully");
//       navigate("/supervisor");
//     } catch {
//       toast.error("Failed to submit review");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const pdfUrl = thesis.pdf
//     ? `${baseURL}/${thesis.pdf.replace(/\\/g, "/")}`
//     : null;

//   const getStatusClasses = (currentStatus) => {
//     switch (currentStatus) {
//       case "accepted":
//         return "bg-green-50 text-green-700 border-green-200";
//       case "pending":
//         return "bg-yellow-50 text-yellow-700 border-yellow-200";
//       case "completed":
//         return "bg-blue-50 text-blue-700 border-blue-200";
//       case "declined":
//         return "bg-red-50 text-red-700 border-red-200";
//       default:
//         return "bg-gray-50 text-gray-700 border-gray-200";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white border rounded-2xl px-8 py-8 text-center w-full max-w-md">
//           <div className="w-10 h-10 mx-auto border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-4"></div>
//           <h2 className="text-lg font-medium text-gray-800">Loading thesis...</h2>
//           <p className="text-sm text-gray-500 mt-2">Please wait a moment.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-800">Review Thesis</h1>
//             <p className="text-sm text-gray-500 mt-1">
//               Review thesis details and submit your feedback.
//             </p>
//           </div>

//           <button
//             onClick={() => navigate(-1)}
//             className="text-sm border bg-white px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
//           >
//             ← Back
//           </button>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Left Section */}
//           <div className="lg:col-span-2 space-y-5">
//             {/* Thesis Overview */}
//             <div className="bg-white border rounded-2xl p-6">
//               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     {thesis.title || "Untitled Thesis"}
//                   </h2>
//                   <p className="text-sm text-gray-500 mt-1">Thesis Overview</p>
//                 </div>

//                 <span
//                   className={`text-xs px-3 py-1 rounded-full border w-fit ${getStatusClasses(
//                     thesis.status
//                   )}`}
//                 >
//                   {thesis.status ? thesis.status.toUpperCase() : "UNKNOWN"}
//                 </span>
//               </div>

//               <div className="border-t pt-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
//                 <p className="text-sm text-gray-600 leading-7">
//                   {thesis.description || "No description available."}
//                 </p>
//               </div>
//             </div>

//             {/* Student Information */}
//             <div className="bg-white border rounded-2xl p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Student Information</h3>

//               <div className="grid sm:grid-cols-2 gap-4">
//                 <div className="bg-gray-50 border rounded-xl p-4">
//                   <p className="text-xs text-gray-500 mb-1">Full Name</p>
//                   <p className="text-sm font-medium text-gray-800">
//                     {thesis.student?.name || "Not available"}
//                   </p>
//                 </div>

//                 <div className="bg-gray-50 border rounded-xl p-4">
//                   <p className="text-xs text-gray-500 mb-1">Email Address</p>
//                   <p className="text-sm font-medium text-gray-800 break-all">
//                     {thesis.student?.email || "Not available"}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Previous Feedback */}
//             <div className="bg-white border rounded-2xl p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Previous Feedback</h3>
//               <div className="bg-gray-50 border rounded-xl p-4 min-h-[120px]">
//                 <p className="text-sm text-gray-600 whitespace-pre-line leading-7">
//                   {thesis.supervisorNote || "No previous feedback available."}
//                 </p>
//               </div>
//             </div>

//             {/* Thesis Document */}
//             <div className="bg-white border rounded-2xl p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Thesis Document</h3>

//               {pdfUrl ? (
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                   <p className="text-sm text-gray-600">
//                     Open the submitted thesis PDF to review the full document.
//                   </p>

//                   <a
//                     href={pdfUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition w-fit"
//                   >
//                     View PDF
//                   </a>
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-500">No PDF available.</p>
//               )}
//             </div>
//           </div>

//           {/* Right Section - Review Form */}
//           <div className="bg-white border rounded-2xl p-6 h-fit lg:sticky lg:top-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-1">Submit Review</h2>
//             <p className="text-sm text-gray-500 mb-6">
//               Update thesis status and write your feedback.
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                   className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
//                 >
//                   <option value="">Choose status</option>
//                   <option value="accepted">Approve</option>
//                   <option value="declined">Reject</option>
//                   <option value="pending">Pending</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Feedback
//                 </label>
//                 <textarea
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                   placeholder="Write your feedback here..."
//                   className="w-full border rounded-lg px-3 py-3 min-h-[180px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
//                 />
//               </div>

//               <div className="flex flex-col gap-3 pt-2">
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-black transition disabled:opacity-70"
//                 >
//                   {submitting ? "Submitting..." : "Submit Review"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => navigate("/supervisor")}
//                   className="w-full border py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  BadgeInfo,
  Building2,
  CalendarDays,
  Clock3,
  FileText,
} from "lucide-react";

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [thesis, setThesis] = useState({});
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const baseURL = "http://localhost:5000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/supervisor/thesis/${id}`);
      setThesis(res.data);

      if (res.data.supervisorNote) setNote(res.data.supervisorNote);
      if (res.data.status) setStatus(res.data.status);
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
      setSubmitting(true);
      await axios.patch("/supervisor/review", {
        thesisId: id,
        status,
        note,
      });
      toast.success("Review submitted successfully");
      navigate("/supervisor");
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const pdfUrl = thesis.pdf
    ? `${baseURL}/${thesis.pdf.replace(/\\/g, "/")}`
    : null;

  const getStatusClasses = (currentStatus) => {
    switch (currentStatus) {
      case "accepted":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "declined":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border rounded-2xl px-8 py-8 text-center w-full max-w-md">
          <div className="w-10 h-10 mx-auto border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-4"></div>
          <h2 className="text-lg font-medium text-gray-800">Loading thesis...</h2>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Review Thesis</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review thesis details and submit your feedback.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="text-sm border bg-white px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            ← Back
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-5">
            {/* Thesis Overview */}
            <div className="bg-white border rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900 break-words">
                    {thesis.title || "Untitled Thesis"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Thesis Overview</p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full border w-fit ${getStatusClasses(
                    thesis.status
                  )}`}
                >
                  {thesis.status ? thesis.status.toUpperCase() : "UNKNOWN"}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-5">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  Submitted:
                  <span className="font-medium text-gray-800">
                    {formatDate(thesis.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-gray-400" />
                  Updated:
                  <span className="font-medium text-gray-800">
                    {formatDate(thesis.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                <p className="text-sm text-gray-600 leading-7 break-words">
                  {thesis.description || "No description available."}
                </p>
              </div>
            </div>

            {/* Student Information */}
            <div className="bg-white border rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Student Information</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">Full Name</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.student?.name || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">Email Address</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800 break-all">
                    {thesis.student?.email || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">Phone Number</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.student?.phone || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeInfo className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">Student ID</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.student?.idNo || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Supervisor Information */}
            <div className="bg-white border rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Supervisor Information</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">Supervisor Name</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.supervisor?.name || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">Email Address</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800 break-all">
                    {thesis.supervisor?.email || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">Phone Number</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.supervisor?.phone || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500">Department</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.supervisor?.department || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Previous Feedback */}
            <div className="bg-white border rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Previous Feedback</h3>
              <div className="bg-gray-50 border rounded-xl p-4 min-h-[120px]">
                <p className="text-sm text-gray-600 whitespace-pre-line leading-7 break-words">
                  {thesis.supervisorNote || "No previous feedback available."}
                </p>
              </div>
            </div>

            {/* Thesis Document */}
            <div className="bg-white border rounded-2xl p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Thesis Document</h3>

              {pdfUrl ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Open the submitted thesis PDF to review the full document.
                  </p>

                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition w-fit"
                  >
                    View PDF
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No PDF available.</p>
              )}
            </div>
          </div>

          {/* Right Section - Review Form */}
          <div className="bg-white border rounded-2xl p-6 h-fit lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Submit Review</h2>
            <p className="text-sm text-gray-500 mb-6">
              Update thesis status and write your feedback.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option value="">Choose status</option>
                  <option value="accepted">Approve</option>
                  <option value="declined">Reject</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write your feedback here..."
                  className="w-full border rounded-lg px-3 py-3 min-h-[180px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-black transition disabled:opacity-70"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/supervisor")}
                  className="w-full border py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}