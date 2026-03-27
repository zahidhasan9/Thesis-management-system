export default function AdminRoleSummary({ roleSummary }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
        <p className="text-xs text-gray-500 mb-2">Admins</p>
        <p className="text-lg font-semibold text-gray-900">
          {roleSummary?.admins || 0}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
        <p className="text-xs text-gray-500 mb-2">Supervisors</p>
        <p className="text-lg font-semibold text-gray-900">
          {roleSummary?.supervisors || 0}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
        <p className="text-xs text-gray-500 mb-2">Evaluators</p>
        <p className="text-lg font-semibold text-gray-900">
          {roleSummary?.evaluators || 0}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
        <p className="text-xs text-gray-500 mb-2">Third Evaluators</p>
        <p className="text-lg font-semibold text-gray-900">
          {roleSummary?.thirdEvaluators || 0}
        </p>
      </div>
    </div>
  );
}