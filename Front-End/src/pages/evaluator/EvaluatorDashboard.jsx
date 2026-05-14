

// import { useEffect, useState } from "react";
// import axios from "../../api/axios";
// import Navbar from "../../components/Navbar";
// import { toast } from "sonner";
// import DashboardStats from "../../components/evaluator/DashboardStats";
// import ThesisTable from "../../components/evaluator/ThesisTable";

// export default function EvaluatorDashboard() {
//   const [theses, setTheses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const user = JSON.parse(localStorage.getItem("user"));
//   const role = user?.role;
//   const isThirdEvaluator = role === "third_evaluator";

//   const navItems = [{ name: "Profile", route: "/evaluator/profile" }];

//   const fetchTheses = async () => {
//     try {
//       setLoading(true);

//       const endpoint = isThirdEvaluator
//         ? "/evaluator/pending-third"
//         : "/evaluator/accepted";

//       const res = await axios.get(endpoint);
//       setTheses(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch theses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTheses();
//   }, [role]);

//   const total = theses.length;
//   const completed = theses.filter((t) => t.status === "completed").length;
//   const pending = theses.filter(
//     (t) => t.status === "pending" || t.status === "accepted"
//   ).length;
//   const declined = theses.filter((t) => t.status === "declined").length;

//   const conflictCases = theses.filter((t) => {
//     if (!t.evaluatorMarks || t.evaluatorMarks.length !== 2) return false;
//     const diff = Math.abs(t.evaluatorMarks[0].mark - t.evaluatorMarks[1].mark);
//     return diff > 14;
//   }).length;

//   const progress = total ? (completed / total) * 100 : 0;

//   return (
//     <>
//       <Navbar
//         items={navItems}
//         portal={isThirdEvaluator ? "Third Evaluator Portal" : "Evaluator Portal"}
//       />

//       <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
//         <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-800">
//                 {isThirdEvaluator
//                   ? "Third Evaluator Dashboard"
//                   : "Evaluator Dashboard"}
//               </h1>
//               <p className="mt-2 text-slate-600">
//                 Review assigned theses, track progress, and evaluate efficiently.
//               </p>
//             </div>

//             <div className="flex items-center gap-3">
//               <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
//                 {isThirdEvaluator ? "Third Evaluator" : "Evaluator"}
//               </span>

//               <button
//                 onClick={fetchTheses}
//                 className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900"
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         <DashboardStats
//           total={total}
//           completed={completed}
//           pending={pending}
//           declined={declined}
//           conflictCases={conflictCases}
//           isThirdEvaluator={isThirdEvaluator}
//         />

//         {total > 0 && (
//           <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="mb-3 flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-slate-800">
//                 Evaluation Progress
//               </h2>
//               <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
//                 {progress.toFixed(0)}% Completed
//               </span>
//             </div>

//             <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200">
//               <div
//                 className="h-4 rounded-full bg-blue-600 transition-all duration-500"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>

//             <p className="mt-2 text-sm text-slate-600">
//               {completed} of {total} theses completed
//             </p>
//           </div>
//         )}

//         <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//           {loading ? (
//             <p className="py-10 text-center text-slate-500">
//               Loading assigned theses...
//             </p>
//           ) : (
//             <ThesisTable theses={theses} isThirdEvaluator={isThirdEvaluator} />
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "sonner";
import DashboardStats from "../../components/evaluator/DashboardStats";
import ThesisTable from "../../components/evaluator/ThesisTable";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export default function EvaluatorDashboard() {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const role = user?.role;
  const isThirdEvaluator = role === "third_evaluator";

  const navItems = [{ name: "Profile", route: "/evaluator/profile" }];

  const getMarkDifference = (thesis) => {
    if (!thesis?.evaluatorMarks || thesis.evaluatorMarks.length !== 2) {
      return 0;
    }

    const firstMark = Number(thesis.evaluatorMarks[0]?.mark || 0);
    const secondMark = Number(thesis.evaluatorMarks[1]?.mark || 0);

    return Math.abs(firstMark - secondMark);
  };

  const isConflictCase = (thesis) => {
    return getMarkDifference(thesis) > 14;
  };

  const isCompleted = (thesis) => {
    return (
      thesis?.status === "completed" ||
      thesis?.finalMark !== null ||
      thesis?.thirdEvaluatorMark?.mark !== undefined
    );
  };

  const fetchTheses = useCallback(async () => {
    try {
      setLoading(true);

      const endpoint = isThirdEvaluator
        ? "/evaluator/pending-third"
        : "/evaluator/accepted";

      const res = await axios.get(endpoint);
      setTheses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to fetch assigned theses"
      );
    } finally {
      setLoading(false);
    }
  }, [isThirdEvaluator]);

  useEffect(() => {
    fetchTheses();
  }, [fetchTheses]);

  const stats = useMemo(() => {
    const total = theses.length;

    const completed = theses.filter((t) => isCompleted(t)).length;

    const declined = theses.filter((t) => t.status === "declined").length;

    const conflictCases = theses.filter((t) => isConflictCase(t)).length;

    const pending = theses.filter(
      (t) => !isCompleted(t) && t.status !== "declined"
    ).length;

    const progress = total ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      declined,
      conflictCases,
      progress,
    };
  }, [theses]);

  const filteredTheses = useMemo(() => {
    if (activeFilter === "pending") {
      return theses.filter((t) => !isCompleted(t) && t.status !== "declined");
    }

    if (activeFilter === "completed") {
      return theses.filter((t) => isCompleted(t));
    }

    if (activeFilter === "conflict") {
      return theses.filter((t) => isConflictCase(t));
    }

    return theses;
  }, [activeFilter, theses]);

  const filterTabs = [
    {
      key: "all",
      label: "All Assigned",
      count: stats.total,
      icon: ClipboardCheck,
    },
    {
      key: "pending",
      label: "Pending Review",
      count: stats.pending,
      icon: Clock3,
    },
    {
      key: "completed",
      label: "Completed",
      count: stats.completed,
      icon: CheckCircle2,
    },
    ...(isThirdEvaluator
      ? [
          {
            key: "conflict",
            label: "Conflict Cases",
            count: stats.conflictCases,
            icon: AlertTriangle,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        items={navItems}
        portal={isThirdEvaluator ? "Third Evaluator Portal" : "Evaluator Portal"}
      />

      <Toaster position="top-right" richColors />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-3">
                <ShieldCheck className="w-4 h-4" />
                {isThirdEvaluator ? "Third Evaluator" : "Evaluator"}
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                {isThirdEvaluator
                  ? "Third Evaluator Dashboard"
                  : "Evaluator Dashboard"}
              </h1>

              <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                Review assigned theses, monitor evaluation progress, and manage
                pending assessment tasks in an organized workspace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchTheses}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black disabled:bg-slate-400 disabled:cursor-not-allowed transition"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-slate-700">
                Evaluation Progress
              </span>
              <span className="font-semibold text-slate-900">
                {stats.progress}% Completed
              </span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                style={{ width: `${stats.progress}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {stats.completed} of {stats.total} assigned thesis records are
              completed.
            </p>
          </div>
        </section>

        {/* Stats */}
        <DashboardStats
          total={stats.total}
          completed={stats.completed}
          pending={stats.pending}
          declined={stats.declined}
          conflictCases={stats.conflictCases}
          isThirdEvaluator={isThirdEvaluator}
        />

        {/* Filter Tabs */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {filterTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeFilter === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => setActiveFilter(item.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Table */}
        {loading ? (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-100 rounded w-1/4" />
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
            </div>
          </section>
        ) : (
          <ThesisTable
            theses={filteredTheses}
            isThirdEvaluator={isThirdEvaluator}
          />
        )}
      </main>
    </div>
  );
}