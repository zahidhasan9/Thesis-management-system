
// import { useEffect, useMemo, useState } from "react";
// import axios from "../../api/axios";
// import Navbar from "../../components/Navbar";
// import { toast, Toaster } from "sonner";
// import {
//   Trash2,
//   FileText,
//   CheckCircle2,
//   XCircle,
//   Clock3,
//   LayoutDashboard,
//   FileUp,
//   UserCircle2,
//   BookOpen,
//   CalendarDays,
//   StickyNote,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function StudentDashboard() {
//   const [thesis, setThesis] = useState([]);

//   useEffect(() => {
//     axios
//       .get("/student/my-thesis")
//       .then((res) => setThesis(res.data))
//       .catch(() => toast.error("Failed to load thesis list"));
//   }, []);

//   const stats = useMemo(() => {
//     const total = thesis.length;
//     const pending = thesis.filter((t) => t.status === "pending").length;
//     const accepted = thesis.filter((t) => t.status === "accepted").length;
//     const declined = thesis.filter((t) => t.status === "declined").length;
//     const completed = thesis.filter((t) => t.status === "completed").length;

//     return { total, pending, accepted, declined, completed };
//   }, [thesis]);

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "pending":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
//             <Clock3 className="w-4 h-4" />
//             Pending
//           </span>
//         );
//       case "accepted":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
//             <CheckCircle2 className="w-4 h-4" />
//             Accepted
//           </span>
//         );
//       case "declined":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
//             <XCircle className="w-4 h-4" />
//             Declined
//           </span>
//         );
//       case "completed":
//         return (
//           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-300 text-blue-800 border border-blue-200">
//             <FileText className="w-4 h-4" />
//             Completed
//           </span>
//         );
//       default:
//         return (
//           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
//             Unknown
//           </span>
//         );
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not available";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const handleDelete = (id, status) => {
//     if (status === "accepted") {
//       toast.error("Accepted thesis cannot be deleted");
//       return;
//     }
//      if (status === "completed") {
//       toast.error("Completed thesis cannot be deleted");
//       return;
//     }

//     axios
//       .delete(`/student/thesis/${id}`)
//       .then(() => {
//         setThesis((prev) => prev.filter((t) => t._id !== id));
//         toast.success("Thesis deleted successfully");
//       })
//       .catch(() => toast.error("Failed to delete thesis"));
//   };

//   const navItems = [
//     // { name: "Upload Thesis", route: "/upload" },
//     // { name: "Profile", route: "/profile" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar items={navItems} portal={"Student Portal"} />
//       <Toaster position="top-right" />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
//         {/* Page Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
//           <div>
//             <p className="text-sm text-gray-500 mb-1">Dashboard Overview</p>
//             <h1 className="text-3xl font-semibold text-gray-800">
//               My Thesis Dashboard
//             </h1>
//             <p className="text-sm text-gray-500 mt-2">
//               Track your thesis submissions, review status, and manage your files.
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <Link
//               to="/upload"
//               className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition"
//             >
//               <FileUp className="w-4 h-4" />
//               Upload Thesis
//             </Link>

//             <Link
//               to="/profile"
//               className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
//             >
//               <UserCircle2 className="w-4 h-4" />
//               Profile
//             </Link>
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-sm text-gray-500">Total Thesis</span>
//               <LayoutDashboard className="w-5 h-5 text-gray-400" />
//             </div>
//             <h2 className="text-2xl font-semibold text-gray-900">{stats.total}</h2>
//           </div>

//           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-sm text-gray-500">Pending</span>
//               <Clock3 className="w-5 h-5 text-yellow-500" />
//             </div>
//             <h2 className="text-2xl font-semibold text-yellow-700">{stats.pending}</h2>
//           </div>

//           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-sm text-gray-500">Accepted</span>
//               <CheckCircle2 className="w-5 h-5 text-green-500" />
//             </div>
//             <h2 className="text-2xl font-semibold text-green-700">{stats.accepted}</h2>
//           </div>

//           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-sm text-gray-500">Declined</span>
//               <XCircle className="w-5 h-5 text-red-500" />
//             </div>
//             <h2 className="text-2xl font-semibold text-red-700">{stats.declined}</h2>
//           </div>
//         </div>

//         {/* Thesis Section */}
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold text-gray-800">My Thesis List</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             All your uploaded thesis files are shown below.
//           </p>
//         </div>

//         {thesis?.length > 0 ? (
//           <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {thesis.map((t) => (
//               <div
//                 key={t._id}
//                 className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col"
//               >
//                 {/* Top */}
//                 <div className="flex items-start justify-between gap-3 mb-4">
//                   <div className="min-w-0">
//                     <div className="flex items-center gap-2 mb-2">
//                       <BookOpen className="w-5 h-5 text-gray-400 shrink-0" />
//                       <h3 className="text-lg font-semibold text-gray-900 truncate">
//                       {/* <h3 className="text-lg font-semibold text-gray-900 line-clamp-2"> */}
//                         {t.title || "Untitled Thesis"}
//                       </h3>
//                     </div>
//                     {getStatusBadge(t.status)}
//                   </div>
//                 </div>

//                 {/* Info */}
//                 <div className="space-y-3 mb-5">
//                   <div className="flex items-start gap-2 text-sm text-gray-600">
//                     <CalendarDays className="w-4 h-4 mt-0.5 text-gray-400" />
//                     <span>
//                       Submitted: <span className="font-medium">{formatDate(t.createdAt)}</span>
//                     </span>
//                   </div>

//                   <div className="flex items-start gap-2 text-sm text-gray-600">
//                     <StickyNote className="w-4 h-4 mt-0.5 text-gray-400" />
//                     <div>
//                       <span className="block text-gray-500 mb-1">Supervisor Note</span>
//                       <p className="text-gray-700 leading-6 line-clamp-3">
//                         {t.supervisorNote?.trim()
//                           ? t.supervisorNote
//                           : "No feedback available yet."}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="mt-auto flex flex-col sm:flex-row gap-3">
//                   {/* <a
//                     href={`http://localhost:5000/${t.pdf}`}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition"
//                   >
//                     <FileText className="w-4 h-4" />
//                     View PDF
//                   </a> */}
                    
//                     <Link
//                       to={`/student/thesis/${t._id}`}
//                       className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
//                     >
//                       Details
//                     </Link>

//                   <button
//                     onClick={() => handleDelete(t._id, t.status)}
//                     className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white transition ${
//                       t.status === "accepted"||t.status === "completed"
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-red-600 hover:bg-red-700"
//                     }`}
//                     disabled={t.status === "accepted"}
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center mt-6">
//             <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
//               <BookOpen className="w-7 h-7 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">
//               No thesis uploaded yet
//             </h3>
//             <p className="text-sm text-gray-500 mb-5">
//               Start by uploading your thesis document to track its review status.
//             </p>
//             <Link
//               to="/upload"
//               className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition"
//             >
//               <FileUp className="w-4 h-4" />
//               Upload Thesis
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useEffect, useMemo, useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "sonner";
import {
  Trash2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock3,
  LayoutDashboard,
  FileUp,
  UserCircle2,
  BookOpen,
  CalendarDays,
  StickyNote,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  LibraryBig,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [thesis, setThesis] = useState([]);
  const [recentThesis, setRecentThesis] = useState([]);

  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryStatus, setLibraryStatus] = useState("all");
  const [libraryDepartment, setLibraryDepartment] = useState("all");
  const [librarySort, setLibrarySort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    axios
      .get("/student/my-thesis")
      .then((res) => setThesis(res.data))
      .catch(() => toast.error("Failed to load thesis list"));

    axios
      .get("/student/recent-thesis")
      .then((res) => setRecentThesis(res.data))
      .catch(() => toast.error("Failed to load thesis library"));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [librarySearch, libraryStatus, libraryDepartment, librarySort, itemsPerPage]);

  const stats = useMemo(() => {
    const total = thesis.length;
    const pending = thesis.filter((t) => t.status === "pending").length;
    const accepted = thesis.filter((t) => t.status === "accepted").length;
    const declined = thesis.filter((t) => t.status === "declined").length;
    const completed = thesis.filter((t) => t.status === "completed").length;

    return { total, pending, accepted, declined, completed };
  }, [thesis]);

  const departments = useMemo(() => {
    const uniqueDepartments = recentThesis
      .map((t) => t.student?.department)
      .filter(Boolean);

    return [...new Set(uniqueDepartments)].sort();
  }, [recentThesis]);

  const filteredLibrary = useMemo(() => {
    let data = [...recentThesis];

    const searchText = librarySearch.toLowerCase().trim();

    if (searchText) {
      data = data.filter((t) => {
        const searchableText = [
          t.title,
          t.description,
          t.status,
          t.student?.name,
          t.student?.department,
          t.student?.batch,
          t.supervisor?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchText);
      });
    }

    if (libraryStatus !== "all") {
      data = data.filter((t) => t.status === libraryStatus);
    }

    if (libraryDepartment !== "all") {
      data = data.filter((t) => t.student?.department === libraryDepartment);
    }

    if (librarySort === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (librarySort === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (librarySort === "title") {
      data.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return data;
  }, [
    recentThesis,
    librarySearch,
    libraryStatus,
    libraryDepartment,
    librarySort,
  ]);

  const totalPages = Math.ceil(filteredLibrary.length / itemsPerPage) || 1;

  const paginatedLibrary = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLibrary.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLibrary, currentPage, itemsPerPage]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock3 className="w-4 h-4" />
            Pending
          </span>
        );

      case "accepted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-4 h-4" />
            Accepted
          </span>
        );

      case "declined":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-4 h-4" />
            Declined
          </span>
        );

      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <FileText className="w-4 h-4" />
            Completed
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            Unknown
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPdfUrl = (pdfPath) => {
    if (!pdfPath) return null;

    const cleanPath = pdfPath.replace(/\\/g, "/").replace(/^\/+/, "");
    return `http://localhost:5000/${cleanPath}`;
  };

  const handleDelete = (id, status) => {
    if (status === "accepted" || status === "completed") {
      toast.error("Accepted or completed thesis cannot be deleted");
      return;
    }

    axios
      .delete(`/student/thesis/${id}`)
      .then(() => {
        setThesis((prev) => prev.filter((t) => t._id !== id));
        toast.success("Thesis deleted successfully");
      })
      .catch(() => toast.error("Failed to delete thesis"));
  };

  const descriptionStyle = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const navItems = [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar items={navItems} portal={"Student Portal"} />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">Dashboard Overview</p>

            <h1 className="text-3xl font-semibold text-gray-800">
              My Thesis Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Track your thesis submission and explore previous thesis for
              research ideas.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition"
            >
              <FileUp className="w-4 h-4" />
              Upload Thesis
            </Link>

            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <UserCircle2 className="w-4 h-4" />
              Profile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Total Thesis</span>
              <LayoutDashboard className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {stats.total}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Pending</span>
              <Clock3 className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-semibold text-yellow-700">
              {stats.pending}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Accepted</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-green-700">
              {stats.accepted}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Completed</span>
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-700">
              {stats.completed}
            </h2>
          </div>
        </div>

        {/* My Thesis */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            My Thesis List
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Your submitted thesis records are shown below.
          </p>
        </div>

        {thesis?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 mb-12">
            {thesis.map((t) => (
              <div
                key={t._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-gray-400 shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {t.title || "Untitled Thesis"}
                      </h3>
                    </div>

                    {getStatusBadge(t.status)}
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 mt-0.5 text-gray-400" />
                    <span>
                      Submitted:{" "}
                      <span className="font-medium">
                        {formatDate(t.createdAt)}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <StickyNote className="w-4 h-4 mt-0.5 text-gray-400" />

                    <div>
                      <span className="block text-gray-500 mb-1">
                        Supervisor Note
                      </span>

                      <p className="text-gray-700 leading-6" style={descriptionStyle}>
                        {t.supervisorNote?.trim()
                          ? t.supervisorNote
                          : "No feedback available yet."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/student/thesis/${t._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Details
                  </Link>

                  <button
                    onClick={() => handleDelete(t._id, t.status)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white transition ${
                      t.status === "accepted" || t.status === "completed"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    disabled={t.status === "accepted" || t.status === "completed"}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center mt-6 mb-12">
            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 text-gray-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No thesis uploaded yet
            </h3>

            <p className="text-sm text-gray-500 mb-5">
              Start by uploading your thesis document.
            </p>

            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition"
            >
              <FileUp className="w-4 h-4" />
              Upload Thesis
            </Link>
          </div>
        )}

        {/* Thesis Library */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <LibraryBig className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Thesis Library
                  </h2>
                </div>

                <p className="text-sm text-gray-500">
                  Browse accepted and completed thesis from the last 4 months for
                  research idea inspiration.
                </p>
              </div>

              <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {filteredLibrary.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {recentThesis.length}
                </span>{" "}
                thesis
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 mt-5">
              <div className="xl:col-span-2 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                  type="text"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="Search by title, student, department..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="relative">
                <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <select
                  value={libraryStatus}
                  onChange={(e) => setLibraryStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="all">All Status</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <select
                value={libraryDepartment}
                onChange={(e) => setLibraryDepartment(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Departments</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              <select
                value={librarySort}
                onChange={(e) => setLibrarySort(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Thesis Title
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Student
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Department
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedLibrary.length > 0 ? (
                  paginatedLibrary.map((t) => {
                    const pdfUrl = getPdfUrl(t.pdf);

                    return (
                      <tr key={t._id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 max-w-md">
                          <p className="font-medium text-gray-900">
                            {t.title || "Untitled Thesis"}
                          </p>

                          <p
                            className="text-xs text-gray-500 mt-1 leading-5"
                            style={descriptionStyle}
                          >
                            {t.description?.trim()
                              ? t.description
                              : "No description available."}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {t.student?.name || "Not available"}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {t.student?.department || "Not available"}
                        </td>

                        <td className="px-5 py-4">{getStatusBadge(t.status)}</td>

                        <td className="px-5 py-4 text-gray-600">
                          {formatDate(t.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          {pdfUrl ? (
                            <a
                              href={pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition"
                            >
                              <FileText className="w-4 h-4" />
                              PDF
                            </a>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-300 text-white rounded-lg cursor-not-allowed"
                            >
                              No PDF
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center">
                      <BookOpen className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-600 font-medium">
                        No thesis found
                      </p>
                      <p className="text-sm text-gray-500">
                        Try changing your search or filter options.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {paginatedLibrary.length > 0 ? (
              paginatedLibrary.map((t) => {
                const pdfUrl = getPdfUrl(t.pdf);

                return (
                  <div
                    key={t._id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t.title || "Untitled Thesis"}
                    </h3>

                    <div className="mb-3">{getStatusBadge(t.status)}</div>

                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                      <p>
                        <span className="font-medium">Student:</span>{" "}
                        {t.student?.name || "Not available"}
                      </p>
                      <p>
                        <span className="font-medium">Department:</span>{" "}
                        {t.student?.department || "Not available"}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {formatDate(t.createdAt)}
                      </p>
                    </div>

                    <p
                      className="text-sm text-gray-500 leading-6 mb-4"
                      style={descriptionStyle}
                    >
                      {t.description?.trim()
                        ? t.description
                        : "No description available."}
                    </p>

                    {pdfUrl ? (
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition"
                      >
                        <FileText className="w-4 h-4" />
                        View PDF
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-300 text-white rounded-lg cursor-not-allowed"
                      >
                        No PDF
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <BookOpen className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600 font-medium">No thesis found</p>
                <p className="text-sm text-gray-500">
                  Try changing your search or filter options.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Rows per page:</span>

              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <p className="text-sm text-gray-600">
                Page{" "}
                <span className="font-semibold text-gray-800">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-800">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}