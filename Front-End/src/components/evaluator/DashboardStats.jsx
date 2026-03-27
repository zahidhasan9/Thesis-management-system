export default function DashboardStats({
  total,
  completed,
  pending,
  declined,
  conflictCases,
  isThirdEvaluator,
}) {
  const stats = [
    {
      title: "Total Assigned",
      value: total,
      text: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      title: "Pending / In Review",
      value: pending,
      text: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      title: "Completed",
      value: completed,
      text: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      title: isThirdEvaluator ? "Conflict Cases" : "Declined",
      value: isThirdEvaluator ? conflictCases : declined,
      text: isThirdEvaluator ? "text-purple-700" : "text-rose-700",
      bg: isThirdEvaluator ? "bg-purple-50" : "bg-rose-50",
    },
  ];

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className={`inline-flex rounded-xl px-3 py-2 text-sm font-medium ${item.bg} ${item.text}`}>
            {item.title}
          </div>

          <h3 className="mt-4 text-3xl font-bold text-slate-800">{item.value}</h3>
        </div>
      ))}
    </div>
  );
}