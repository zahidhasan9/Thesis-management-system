

// import {
//   AlertTriangle,
//   CheckCircle2,
//   ClipboardList,
//   Clock3,
//   XCircle,
// } from "lucide-react";

// export default function DashboardStats({
//   total,
//   completed,
//   pending,
//   declined,
//   conflictCases,
//   isThirdEvaluator,
// }) {
//   const stats = [
//     {
//       title: "Total Assigned",
//       value: total,
//       helper: "All thesis assigned to you",
//       icon: ClipboardList,
//       card: "bg-blue-50 border-blue-100",
//       iconBox: "bg-blue-100 text-blue-700",
//       valueText: "text-blue-800",
//     },
//     {
//       title: "Pending Review",
//       value: pending,
//       helper: "Waiting for evaluation",
//       icon: Clock3,
//       card: "bg-amber-50 border-amber-100",
//       iconBox: "bg-amber-100 text-amber-700",
//       valueText: "text-amber-800",
//     },
//     {
//       title: "Completed",
//       value: completed,
//       helper: "Evaluation completed",
//       icon: CheckCircle2,
//       card: "bg-emerald-50 border-emerald-100",
//       iconBox: "bg-emerald-100 text-emerald-700",
//       valueText: "text-emerald-800",
//     },
//     {
//       title: isThirdEvaluator ? "Conflict Cases" : "Declined",
//       value: isThirdEvaluator ? conflictCases : declined,
//       helper: isThirdEvaluator
//         ? "Needs third evaluator decision"
//         : "Declined thesis records",
//       icon: isThirdEvaluator ? AlertTriangle : XCircle,
//       card: isThirdEvaluator
//         ? "bg-purple-50 border-purple-100"
//         : "bg-rose-50 border-rose-100",
//       iconBox: isThirdEvaluator
//         ? "bg-purple-100 text-purple-700"
//         : "bg-rose-100 text-rose-700",
//       valueText: isThirdEvaluator ? "text-purple-800" : "text-rose-800",
//     },
//   ];

//   return (
//     <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
//       {stats.map((item) => {
//         const Icon = item.icon;

//         return (
//           <div
//             key={item.title}
//             className={`border rounded-2xl p-5 shadow-sm ${item.card}`}
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <p className="text-sm font-medium text-slate-600">
//                   {item.title}
//                 </p>

//                 <h3 className={`text-3xl font-bold mt-2 ${item.valueText}`}>
//                   {item.value || 0}
//                 </h3>

//                 <p className="text-xs text-slate-500 mt-2">{item.helper}</p>
//               </div>

//               <div
//                 className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.iconBox}`}
//               >
//                 <Icon className="w-5 h-5" />
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </section>
//   );
// }

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  XCircle,
} from "lucide-react";

export default function DashboardStats({
  total = 0,
  completed = 0,
  pending = 0,
  declined = 0,
  conflictCases = 0,
  isThirdEvaluator = false,
}) {
  const stats = [
    {
      title: "Total Assigned",
      value: total,
      subtitle: "All assigned thesis records",
      icon: ClipboardList,
      wrapper: "bg-blue-50 border-blue-100",
      iconBox: "bg-blue-100 text-blue-700",
      valueText: "text-blue-800",
    },
    {
      title: "Pending Review",
      value: pending,
      subtitle: "Waiting for evaluation",
      icon: Clock3,
      wrapper: "bg-amber-50 border-amber-100",
      iconBox: "bg-amber-100 text-amber-700",
      valueText: "text-amber-800",
    },
    {
      title: "Completed",
      value: completed,
      subtitle: "Evaluation finalized",
      icon: CheckCircle2,
      wrapper: "bg-emerald-50 border-emerald-100",
      iconBox: "bg-emerald-100 text-emerald-700",
      valueText: "text-emerald-800",
    },
    {
      title: isThirdEvaluator ? "Conflict Cases" : "Declined",
      value: isThirdEvaluator ? conflictCases : declined,
      subtitle: isThirdEvaluator
        ? "Needs third evaluator review"
        : "Declined thesis records",
      icon: isThirdEvaluator ? AlertTriangle : XCircle,
      wrapper: isThirdEvaluator
        ? "bg-purple-50 border-purple-100"
        : "bg-rose-50 border-rose-100",
      iconBox: isThirdEvaluator
        ? "bg-purple-100 text-purple-700"
        : "bg-rose-100 text-rose-700",
      valueText: isThirdEvaluator ? "text-purple-800" : "text-rose-800",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={`border rounded-3xl p-5 shadow-sm ${item.wrapper}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  {item.title}
                </p>

                <h3 className={`text-4xl font-bold mt-2 ${item.valueText}`}>
                  {item.value}
                </h3>

                <p className="text-xs text-slate-500 mt-2">
                  {item.subtitle}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.iconBox}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}