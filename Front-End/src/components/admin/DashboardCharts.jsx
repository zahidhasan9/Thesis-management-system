import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function DashboardCharts({ chartData, pieData }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="h-[360px] rounded-3xl border border-white bg-white/90 p-5 shadow-xl shadow-indigo-100/60">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Monthly Thesis Submissions
          </h2>
        </div>

        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[360px] rounded-3xl border border-white bg-white/90 p-5 shadow-xl shadow-indigo-100/60">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Thesis Status Overview
          </h2>
        </div>

        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={95}
            >
              {pieData.map((entry, index) => {
                let color = "#111827";
                if (entry.name === "Completed") color = "#16a34a";
                if (entry.name === "Pending") color = "#f59e0b";
                if (entry.name === "Declined") color = "#ef4444";

                return <Cell key={index} fill={color} />;
              })}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
