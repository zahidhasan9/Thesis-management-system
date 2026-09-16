export default function PendingThesisTable({ pending }) {
  return (
    <div className="rounded-3xl border border-white bg-white/90 p-6 shadow-xl shadow-indigo-100/60">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-800">
          Pending Thesis Review
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Thesis submissions currently awaiting progress
        </p>
      </div>

      {pending?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-50/70 text-left">
                <th className="p-3 border-b text-sm font-semibold text-gray-700">
                  Student
                </th>
                <th className="p-3 border-b text-sm font-semibold text-gray-700">
                  Thesis Title
                </th>
                <th className="p-3 border-b text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p._id} className="transition hover:bg-indigo-50/50">
                  <td className="p-3 border-b text-sm text-gray-700">
                    {p.student?.name || "-"}
                  </td>
                  <td className="p-3 border-b text-sm text-gray-700">
                    {p.title || "-"}
                  </td>
                  <td className="p-3 border-b text-sm">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 capitalize">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-sm text-gray-500">
          No pending thesis records found.
        </div>
      )}
    </div>
  );
}
