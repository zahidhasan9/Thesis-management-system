import {
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";

export default function AdminStatsCards({
  stats,
  thesisCount,
  declinedCount,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Total Students</span>
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          {stats.totalStudents || 0}
        </h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Pending Thesis</span>
          <Clock3 className="w-5 h-5 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-semibold text-yellow-700">
          {stats.pending || 0}
        </h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Completed</span>
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold text-green-700">
          {stats.completed || 0}
        </h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Declined Thesis</span>
          <XCircle className="w-5 h-5 text-red-500" />
        </div>
        <h2 className="text-2xl font-semibold text-red-700">
          {declinedCount || 0}
        </h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Total Thesis</span>
          <FileText className="w-5 h-5 text-blue-500" />
        </div>
        <h2 className="text-2xl font-semibold text-blue-700">
          {thesisCount || 0}
        </h2>
      </div>
    </div>
  );
}