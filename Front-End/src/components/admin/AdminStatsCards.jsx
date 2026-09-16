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
      <div className="rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-lg shadow-indigo-100/60">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">Total Students</span>
          <span className="rounded-xl bg-indigo-100 p-2 text-indigo-600"><Users className="w-5 h-5" /></span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900">
          {stats.totalStudents || 0}
        </h2>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-white/90 p-5 shadow-lg shadow-amber-100/60">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">Pending Thesis</span>
          <span className="rounded-xl bg-amber-100 p-2 text-amber-600"><Clock3 className="w-5 h-5" /></span>
        </div>
        <h2 className="text-3xl font-bold text-amber-700">
          {stats.pending || 0}
        </h2>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-lg shadow-emerald-100/60">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">Completed</span>
          <span className="rounded-xl bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="w-5 h-5" /></span>
        </div>
        <h2 className="text-3xl font-bold text-emerald-700">
          {stats.completed || 0}
        </h2>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white/90 p-5 shadow-lg shadow-rose-100/60">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">Declined Thesis</span>
          <span className="rounded-xl bg-rose-100 p-2 text-rose-600"><XCircle className="w-5 h-5" /></span>
        </div>
        <h2 className="text-3xl font-bold text-rose-700">
          {declinedCount || 0}
        </h2>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-lg shadow-sky-100/60">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">Total Thesis</span>
          <span className="rounded-xl bg-sky-100 p-2 text-sky-600"><FileText className="w-5 h-5" /></span>
        </div>
        <h2 className="text-3xl font-bold text-sky-700">
          {thesisCount || 0}
        </h2>
      </div>
    </div>
  );
}
