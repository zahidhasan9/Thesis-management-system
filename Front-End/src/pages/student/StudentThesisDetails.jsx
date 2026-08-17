import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, GraduationCap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import axios from "../../api/axios";
import { fileUrl } from "../../config/api";

export default function StudentThesisDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get(`/student/thesis/${id}`).then((res) => setThesis(res.data)).catch((error) => toast.error(error.response?.data?.message || "Could not load thesis")).finally(() => setLoading(false));
  }, [id]);
  if (loading) return <div className="min-h-screen grid place-items-center bg-gray-50">Loading thesis...</div>;
  if (!thesis) return <div className="min-h-screen grid place-items-center">Thesis not found</div>;
  const pdfUrl = fileUrl(thesis.pdf);
  const resultReady = thesis.resultPublished === true && thesis.finalMarkStatus === "published" && Boolean(thesis.grade);
  const progressLabel = thesis.finalMarkStatus === "approved" ? "Result Not Published" : thesis.finalMarkStatus === "calculated" ? "Final Mark Under Review" : "Evaluation in Progress";
  return <main className="min-h-screen bg-gray-50 px-4 py-8"><div className="mx-auto max-w-5xl space-y-6">
    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-600"><ArrowLeft size={17}/> Back</button>
    <header className="border-b pb-5"><p className="text-sm text-gray-500">My Thesis</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">{thesis.title}</h1><div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600"><span className="capitalize">Status: {thesis.status}</span><span className="inline-flex items-center gap-1"><Calendar size={15}/>{new Date(thesis.createdAt).toLocaleDateString()}</span></div></header>
    <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6"><div className="rounded-lg border bg-white p-5"><h2 className="font-semibold">Proposal details</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-blue-50 p-3"><p className="text-xs text-blue-600">AI Score</p><p className="mt-1 font-semibold text-blue-900">{thesis.aiScore == null ? "Not provided" : `${thesis.aiScore}%`}</p>{thesis.aiCheckUrl && <a className="mt-2 inline-block text-xs font-semibold text-blue-700 underline" href={thesis.aiCheckUrl} rel="noreferrer" target="_blank">Open reference</a>}</div><div className="rounded-lg bg-emerald-50 p-3"><p className="text-xs text-emerald-600">Plagiarism Score</p><p className="mt-1 font-semibold text-emerald-900">{thesis.plagiarismScore == null ? "Not provided" : `${thesis.plagiarismScore}%`}</p>{thesis.plagiarismCheckUrl && <a className="mt-2 inline-block text-xs font-semibold text-emerald-700 underline" href={thesis.plagiarismCheckUrl} rel="noreferrer" target="_blank">Open reference</a>}</div></div><p className="mt-3 text-sm leading-7 text-gray-600">{thesis.description || "No description provided."}</p>{pdfUrl && <a href={pdfUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm"><FileText size={16}/> View PDF</a>}</div>
      <div className="rounded-lg border bg-white p-5"><div className="flex items-center gap-2"><ShieldCheck size={19}/><h2 className="font-semibold">Supervisor</h2></div><p className="mt-4 font-medium">{thesis.supervisor?.name || "Not assigned yet"}</p>{thesis.supervisor?.department && <p className="mt-1 text-sm text-gray-500">{thesis.supervisor.department}</p>}<p className="mt-4 text-sm text-gray-600">{thesis.supervisorNote || "No supervisor note available."}</p></div>
      {thesis.studentFeedbackPublished && <div className="rounded-lg border bg-white p-5"><h2 className="font-semibold">Approved Evaluation Feedback</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">{thesis.studentFeedback}</p><p className="mt-3 text-xs text-gray-400">{thesis.studentFeedbackPublishedAt ? new Date(thesis.studentFeedbackPublishedAt).toLocaleString() : ""}</p></div>}</div>
      <aside className="rounded-lg border bg-white p-5 self-start"><div className="flex items-center gap-2"><GraduationCap size={20}/><h2 className="font-semibold">Final Result</h2></div>{resultReady ? <><p className="mt-6 text-5xl font-semibold text-gray-900">{thesis.grade}</p><p className="mt-2 text-sm text-emerald-700">Result Status: Published</p><p className="mt-1 text-xs text-gray-500">{thesis.resultPublishedAt ? new Date(thesis.resultPublishedAt).toLocaleString() : ""}</p></> : <><p className="mt-6 text-xl font-semibold text-gray-800">{progressLabel}</p><p className="mt-2 text-sm leading-6 text-gray-500">Your grade will appear only after Admin approval and publication.</p></>}</aside>
    </section>
  </div></main>;
}
