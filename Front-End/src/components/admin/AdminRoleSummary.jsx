export default function AdminRoleSummary({ roleSummary }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-violet-100 bg-white/90 p-4 shadow-lg shadow-violet-100/60">
        <p className="text-xs text-gray-500 mb-2">Admins</p>
        <p className="text-2xl font-bold text-violet-700">
          {roleSummary?.admins || 0}
        </p>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-lg shadow-sky-100/60">
        <p className="text-xs text-gray-500 mb-2">Supervisors</p>
        <p className="text-2xl font-bold text-sky-700">
          {roleSummary?.supervisors || 0}
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-lg shadow-emerald-100/60">
        <p className="text-xs text-gray-500 mb-2">Evaluators</p>
        <p className="text-2xl font-bold text-emerald-700">
          {roleSummary?.evaluators || 0}
        </p>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-lg shadow-amber-100/60">
        <p className="text-xs text-gray-500 mb-2">Third Evaluators</p>
        <p className="text-2xl font-bold text-amber-700">
          {roleSummary?.thirdEvaluators || 0}
        </p>
      </div>
    </div>
  );
}
