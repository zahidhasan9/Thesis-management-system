import { useNavigate } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";

export default function ThesisTable({ theses = [] }) {
  const navigate = useNavigate();
  if (!theses.length) return <div className="py-14 text-center text-gray-500"><ClipboardCheck className="mx-auto mb-3"/><p>No evaluator assignments found.</p></div>;
  return <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="bg-gray-50 text-left text-gray-600"><tr><th className="p-3">Student</th><th className="p-3">Thesis</th><th className="p-3">Position</th><th className="p-3">Request</th><th className="p-3">My evaluation</th><th className="p-3">Action</th></tr></thead><tbody>
    {theses.map((thesis) => { const mine = thesis.evaluatorAssignments?.[0]; return <tr key={thesis._id} className="border-t"><td className="p-3"><p className="font-medium text-gray-900">{thesis.student?.name}</p><p className="text-xs text-gray-500">{thesis.student?.idNo}</p></td><td className="p-3 max-w-xs"><p className="font-medium text-gray-900">{thesis.title}</p><p className="truncate text-xs text-gray-500">{thesis.description}</p></td><td className="p-3">Evaluator {mine?.position}</td><td className="p-3 capitalize">{mine?.status || "pending"}</td><td className="p-3">{mine?.mark != null ? `Submitted (${mine.mark})` : "Not submitted"}</td><td className="p-3"><button onClick={() => navigate(`/evaluator/thesis/${thesis._id}`)} className="rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white">Review</button></td></tr>; })}
  </tbody></table></div>;
}
