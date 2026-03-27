export default function StatusBadge({ status, isConflict = false, isThirdEvaluator = false }) {
  let label = "Pending";
  let classes = "bg-slate-100 text-slate-700";

  if (status === "completed") {
    label = "Completed";
    classes = "bg-emerald-100 text-emerald-700";
  } else if (status === "declined") {
    label = "Declined";
    classes = "bg-rose-100 text-rose-700";
  } else if (isConflict && isThirdEvaluator) {
    label = "Conflict";
    classes = "bg-amber-100 text-amber-700";
  } else if (status === "accepted") {
    label = "In Review";
    classes = "bg-blue-100 text-blue-700";
  } else if (status === "pending") {
    label = "Pending";
    classes = "bg-slate-100 text-slate-700";
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}