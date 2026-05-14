// export default function StatusBadge({ status, isConflict = false, isThirdEvaluator = false }) {
//   let label = "Pending";
//   let classes = "bg-slate-100 text-slate-700";

//   if (status === "completed") {
//     label = "Completed";
//     classes = "bg-emerald-100 text-emerald-700";
//   } else if (status === "declined") {
//     label = "Declined";
//     classes = "bg-rose-100 text-rose-700";
//   } else if (isConflict && isThirdEvaluator) {
//     label = "Conflict";
//     classes = "bg-amber-100 text-amber-700";
//   } else if (status === "accepted") {
//     label = "In Review";
//     classes = "bg-blue-100 text-blue-700";
//   } else if (status === "pending") {
//     label = "Pending";
//     classes = "bg-slate-100 text-slate-700";
//   }

//   return (
//     <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
//       {label}
//     </span>
//   );
// }

export default function StatusBadge({
  status,
  isConflict = false,
  isThirdEvaluator = false,
}) {
  let label = "Pending";
  let dot = "bg-slate-500";
  let classes = "bg-slate-100 text-slate-700 border-slate-200";

  if (isConflict && isThirdEvaluator && status !== "completed") {
    label = "Conflict";
    dot = "bg-amber-500";
    classes = "bg-amber-100 text-amber-800 border-amber-200";
  } else if (status === "completed") {
    label = "Completed";
    dot = "bg-emerald-500";
    classes = "bg-emerald-100 text-emerald-800 border-emerald-200";
  } else if (status === "declined") {
    label = "Declined";
    dot = "bg-rose-500";
    classes = "bg-rose-100 text-rose-800 border-rose-200";
  } else if (status === "accepted") {
    label = "In Review";
    dot = "bg-blue-500";
    classes = "bg-blue-100 text-blue-800 border-blue-200";
  } else if (status === "pending") {
    label = "Pending";
    dot = "bg-slate-500";
    classes = "bg-slate-100 text-slate-700 border-slate-200";
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${classes}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}