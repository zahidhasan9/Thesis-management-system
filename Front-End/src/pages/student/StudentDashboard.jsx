
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
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [thesis, setThesis] = useState([]);

  useEffect(() => {
    axios
      .get("/student/my-thesis")
      .then((res) => setThesis(res.data))
      .catch(() => toast.error("Failed to load thesis list"));
  }, []);

  const stats = useMemo(() => {
    const total = thesis.length;
    const pending = thesis.filter((t) => t.status === "pending").length;
    const accepted = thesis.filter((t) => t.status === "accepted").length;
    const declined = thesis.filter((t) => t.status === "declined").length;
    const completed = thesis.filter((t) => t.status === "completed").length;

    return { total, pending, accepted, declined, completed };
  }, [thesis]);

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-300 text-blue-800 border border-blue-200">
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

  const handleDelete = (id, status) => {
    if (status === "accepted") {
      toast.error("Accepted thesis cannot be deleted");
      return;
    }
     if (status === "completed") {
      toast.error("Completed thesis cannot be deleted");
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

  const navItems = [
    // { name: "Upload Thesis", route: "/upload" },
    // { name: "Profile", route: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar items={navItems} portal={"Student Portal"} />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">Dashboard Overview</p>
            <h1 className="text-3xl font-semibold text-gray-800">
              My Thesis Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Track your thesis submissions, review status, and manage your files.
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

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Total Thesis</span>
              <LayoutDashboard className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">{stats.total}</h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Pending</span>
              <Clock3 className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-semibold text-yellow-700">{stats.pending}</h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Accepted</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold text-green-700">{stats.accepted}</h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Declined</span>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-2xl font-semibold text-red-700">{stats.declined}</h2>
          </div>
        </div>

        {/* Thesis Section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">My Thesis List</h2>
          <p className="text-sm text-gray-500 mt-1">
            All your uploaded thesis files are shown below.
          </p>
        </div>

        {thesis?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {thesis.map((t) => (
              <div
                key={t._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-gray-400 shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {/* <h3 className="text-lg font-semibold text-gray-900 line-clamp-2"> */}
                        {t.title || "Untitled Thesis"}
                      </h3>
                    </div>
                    {getStatusBadge(t.status)}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 mt-0.5 text-gray-400" />
                    <span>
                      Submitted: <span className="font-medium">{formatDate(t.createdAt)}</span>
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <StickyNote className="w-4 h-4 mt-0.5 text-gray-400" />
                    <div>
                      <span className="block text-gray-500 mb-1">Supervisor Note</span>
                      <p className="text-gray-700 leading-6 line-clamp-3">
                        {t.supervisorNote?.trim()
                          ? t.supervisorNote
                          : "No feedback available yet."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  {/* <a
                    href={`http://localhost:5000/${t.pdf}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition"
                  >
                    <FileText className="w-4 h-4" />
                    View PDF
                  </a> */}
                    
                    <Link
                      to={`/student/thesis/${t._id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Details
                    </Link>

                  <button
                    onClick={() => handleDelete(t._id, t.status)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white transition ${
                      t.status === "accepted"||t.status === "completed"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    disabled={t.status === "accepted"}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center mt-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No thesis uploaded yet
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Start by uploading your thesis document to track its review status.
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
      </div>
    </div>
  );
}