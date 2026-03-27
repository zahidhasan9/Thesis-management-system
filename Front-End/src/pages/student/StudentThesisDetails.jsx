import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  User,
  Mail,
  Phone,
  GraduationCap,
  StickyNote,
  ShieldCheck,
  BadgePercent,
  Users,
} from "lucide-react";

export default function StudentThesisDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseURL = "http://localhost:5000";

  useEffect(() => {
    fetchThesisDetails();
  }, [id]);

  const fetchThesisDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/student/thesis/${id}`);
      setThesis(res.data);
    } catch (error) {
      toast.error("Failed to load thesis details");
    } finally {
      setLoading(false);
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

  const pdfUrl = thesis?.pdf
    ? `${baseURL}/${thesis.pdf.replace(/\\/g, "/")}`
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-8 text-center">
          <div className="w-10 h-10 mx-auto border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-800">
            Loading thesis details...
          </h2>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (!thesis) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-8 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Thesis not found
          </h2>
          <p className="text-sm text-gray-500 mt-2 mb-5">
            The requested thesis details could not be loaded.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Student Portal</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Thesis Details
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              View your thesis information, supervisor review, and evaluator marks.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="w-fit inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Top Summary */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-gray-400 shrink-0" />
        <h2 className="text-2xl font-semibold text-gray-900 break-words">
          {thesis.title || "Untitled Thesis"}
        </h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {getStatusBadge(thesis.status)}
        {typeof thesis.finalMark === "number" && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <BadgePercent className="w-4 h-4" />
            Final Mark: {thesis.finalMark}
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-400" />
          Submitted:{" "}
          <span className="font-medium text-gray-800">
            {formatDate(thesis.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="w-4 h-4 text-gray-400" />
          Updated:{" "}
          <span className="font-medium text-gray-800">
            {formatDate(thesis.updatedAt)}
          </span>
        </div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition"
        >
          <FileText className="w-4 h-4" />
          View PDF
        </a>
      )}
    </div>
  </div>

  {/* Description Section */}
  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
    <p className="text-lg text-gray-800 mb-2">Description</p>
    <p className="text-sm font-medium text-gray-700 leading-6 break-words">
      {thesis.description || "No description available"}
    </p>
  </div>
</div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Information */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <GraduationCap className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Student Information
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.student?.name || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-800 break-all">
                    {thesis.student?.email || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">ID Number</p>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.student?.idNo || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.student?.phone || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Supervisor Review */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <ShieldCheck className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Supervisor Review
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Supervisor Name</p>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.supervisor?.name || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.supervisor?.department || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-800 break-all">
                    {thesis.supervisor?.email || "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.supervisor?.phone || "Not available"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">Supervisor Note</p>
                <p className="text-sm text-gray-700 leading-7 whitespace-pre-line">
                  {thesis.supervisorNote?.trim()
                    ? thesis.supervisorNote
                    : "No supervisor feedback available yet."}
                </p>
              </div>
            </div>

            {/* Evaluator Marks */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Users className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Evaluator Marks
                </h3>
              </div>

              <div className="space-y-4">
                {thesis.evaluatorMarks?.length > 0 ? (
                  thesis.evaluatorMarks.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Evaluator {index + 1}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.evaluator?.name || "Not available"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.evaluator?.email || ""}
                          </p>
                        </div>

                        <div className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-semibold text-gray-800 w-fit">
                          Mark: {item.mark ?? "N/A"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
                    No evaluator marks available yet.
                  </div>
                )}

                {thesis.thirdEvaluatorMark?.mark != null && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-blue-900">
                          Third Evaluator
                        </p>
                        <p className="text-sm text-blue-800 mt-1">
                          {thesis.thirdEvaluatorMark?.evaluator?.name ||
                            "Not available"}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          {thesis.thirdEvaluatorMark?.evaluator?.email || ""}
                        </p>
                      </div>

                      <div className="px-4 py-2 rounded-lg bg-white border border-blue-200 text-sm font-semibold text-blue-900 w-fit">
                        Mark: {thesis.thirdEvaluatorMark?.mark}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Final Result */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Final Result
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Current Status</p>
                  <div>{getStatusBadge(thesis.status)}</div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Final Mark</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {typeof thesis.finalMark === "number"
                      ? thesis.finalMark
                      : "Not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Third Evaluation</p>
                  <p className="text-sm font-medium text-gray-800">
                    {thesis.thirdEvaluatorMark?.mark != null ? "Applied" : "Not Applied"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Information */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Information
              </h3>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Student</p>
                    <p className="font-medium">
                      {thesis.student?.name || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Supervisor Email</p>
                    <p className="font-medium break-all">
                      {thesis.supervisor?.email || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Supervisor Phone</p>
                    <p className="font-medium">
                      {thesis.supervisor?.phone || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <StickyNote className="w-4 h-4 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Supervisor Note</p>
                    <p className="font-medium line-clamp-4">
                      {thesis.supervisorNote?.trim()
                        ? thesis.supervisorNote
                        : "No note available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PDF button */}
            {pdfUrl && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Thesis Document
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Open your uploaded thesis PDF in a new page.
                </p>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition"
                >
                  <FileText className="w-4 h-4" />
                  View PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}