import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CalendarDays,
  BadgePercent,
  User,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminThesisDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseURL = "http://localhost:5000";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`/admin/thesis/${id}`);
        setThesis(res.data);
      } catch (err) {
        toast.error("Failed to load thesis details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const pdfUrl = thesis?.pdf
    ? `${baseURL}/${thesis.pdf.replace(/\\/g, "/")}`
    : null;

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!thesis) {
    return <div className="p-8">No thesis found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Thesis Details
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Full academic submission details
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <h2 className="text-2xl font-semibold text-gray-900 break-words">
                  {thesis.title || "Untitled Thesis"}
                </h2>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  Created: {formatDate(thesis.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <BadgePercent className="w-4 h-4 text-gray-400" />
                  Final Mark: {typeof thesis.finalMark === "number" ? thesis.finalMark : "-"}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-800 mb-2">Description</p>
                <p className="text-sm text-gray-600 leading-7">
                  {thesis.description || "No description available"}
                </p>
              </div>
            </div>

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black h-fit"
              >
                <FileText className="w-4 h-4" />
                View PDF
              </a>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Information</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Name</p>
                <p className="text-sm font-medium text-gray-800">{thesis.student?.name || "-"}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-800">{thesis.student?.email || "-"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Supervisor Information</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Name</p>
                <p className="text-sm font-medium text-gray-800">{thesis.supervisor?.name || "-"}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-800">{thesis.supervisor?.email || "-"}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="text-sm font-medium text-gray-800">{thesis.supervisor?.department || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Supervisor Note</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 leading-7">
              {thesis.supervisorNote || "No supervisor note available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}