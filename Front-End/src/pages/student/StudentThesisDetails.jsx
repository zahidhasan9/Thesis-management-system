import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle2, Clock3, FileText, GraduationCap, ShieldCheck, Sparkles, ClipboardCheck, MessageSquareText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import axios from "../../api/axios";
import { fileUrl } from "../../config/api";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  accepted: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  declined: "bg-rose-100 text-rose-800 ring-rose-200",
  completed: "bg-sky-100 text-sky-800 ring-sky-200",
};

export default function StudentThesisDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get(`/student/thesis/${id}`), axios.get(`/student/thesis/${id}/timeline`)])
      .then(([detail, timelineResponse]) => { setThesis(detail.data); setTimeline(timelineResponse.data || []); })
      .catch((error) => toast.error(error.response?.data?.message || "Could not load thesis"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm font-medium text-slate-500">Loading thesis details...</div>;
  if (!thesis) return <div className="grid min-h-screen place-items-center">Thesis not found</div>;

  const pdfUrl = fileUrl(thesis.pdf);
  const verificationReportUrl = fileUrl(thesis.verificationReportPdf || thesis.aiReportPdf || thesis.plagiarismReportPdf);
  const resultReady = thesis.resultPublished === true && thesis.finalMarkStatus === "published" && Boolean(thesis.grade);
  const progressLabel = thesis.finalMarkStatus === "approved" ? "Result Not Published" : thesis.finalMarkStatus === "calculated" ? "Final Mark Under Review" : "Evaluation in Progress";
  const status = thesis.status || "pending";

  return <main className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-100 px-4 py-6 sm:py-8"><div className="mx-auto max-w-6xl space-y-6">
    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-white hover:text-indigo-700"><ArrowLeft size={17} /> Back to dashboard</button>

    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-violet-700 to-fuchsia-700 p-6 text-white shadow-xl shadow-indigo-200 sm:p-8"><div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" /><div className="absolute bottom-0 right-1/3 h-20 w-20 rounded-full bg-cyan-300/20" /><div className="relative"><div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide"><Sparkles size={14} /> MY THESIS</span><span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${statusStyles[status] || "bg-slate-100 text-slate-700 ring-slate-200"}`}>{status}</span></div><h1 className="mt-4 max-w-4xl text-2xl font-bold leading-tight sm:text-4xl">{thesis.title || "Untitled Thesis"}</h1><div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-indigo-100"><span className="inline-flex items-center gap-2"><Calendar size={16} /> Submitted {new Date(thesis.createdAt).toLocaleDateString()}</span><span className="inline-flex items-center gap-2"><ShieldCheck size={16} /> Supervisor ID: {thesis.supervisor?.idNo || "Not assigned"}</span></div></div></section>

    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-6">
      <Card icon={<ClipboardCheck size={20} />} iconClass="bg-violet-100 text-violet-700" title="Submission overview" subtitle="Originality scores and submitted documents"><div className="grid gap-4 sm:grid-cols-2"><ScoreCard label="AI Score" value={thesis.aiScore} tone="indigo" /><ScoreCard label="Plagiarism Score" value={thesis.plagiarismScore} tone="emerald" /></div><p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">{thesis.description || "No description provided."}</p><div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">{pdfUrl && <DocumentLink href={pdfUrl} label="View Thesis PDF" />}{verificationReportUrl && <DocumentLink href={verificationReportUrl} label="AI & Plagiarism Report" secondary />}</div></Card>
      <Card icon={<MessageSquareText size={20} />} iconClass="bg-amber-100 text-amber-700" title="Supervisor feedback" subtitle="Comments from your supervisor"><div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-sm leading-7 text-slate-700">{thesis.supervisorNote || "No supervisor comment available yet."}</div></Card>
      <Card icon={<MessageSquareText size={20} />} iconClass="bg-sky-100 text-sky-700" title="Evaluator feedback" subtitle="Feedback becomes available as evaluators complete their review"><div className="space-y-3">{thesis.evaluatorFeedback?.length ? thesis.evaluatorFeedback.map((item) => <div key={`${item.position}-${item.submittedAt}`} className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4"><p className="text-sm font-semibold text-sky-900">Evaluator {item.position}</p><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{item.feedback}</p>{item.submittedAt && <p className="mt-3 text-xs font-medium text-slate-400">Submitted {new Date(item.submittedAt).toLocaleString()}</p>}</div>) : <EmptyMessage text="No evaluator feedback available yet." />}</div></Card>
      <Timeline timeline={timeline} />
      {thesis.studentFeedbackPublished && <article className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-5 shadow-lg shadow-emerald-100/40 sm:p-6"><h2 className="font-bold text-emerald-900">Approved evaluation feedback</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-emerald-900/80">{thesis.studentFeedback}</p>{thesis.studentFeedbackPublishedAt && <p className="mt-3 text-xs font-medium text-emerald-700">Published {new Date(thesis.studentFeedbackPublishedAt).toLocaleString()}</p>}</article>}
    </div>
    <aside className="h-fit rounded-3xl border border-white bg-white/90 p-6 shadow-lg shadow-indigo-100/60 lg:sticky lg:top-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200"><GraduationCap size={23} /></span><p className="mt-4 text-sm font-medium text-slate-500">Final result</p>{resultReady ? <><p className="mt-2 text-6xl font-bold tracking-tight text-indigo-700">{thesis.grade}</p><span className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Published</span><p className="mt-3 text-xs leading-5 text-slate-500">Published {thesis.resultPublishedAt ? new Date(thesis.resultPublishedAt).toLocaleString() : ""}</p></> : <><p className="mt-4 text-xl font-bold text-slate-800">{progressLabel}</p><p className="mt-3 text-sm leading-6 text-slate-500">Your grade will appear here after admin approval and publication.</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-indigo-100"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" /></div></>}</aside></section>
  </div></main>;
}

function Card({ icon, iconClass, title, subtitle, children }) { return <article className="rounded-3xl border border-white bg-white/90 p-5 shadow-lg shadow-indigo-100/60 sm:p-6"><div className="flex items-center gap-3"><span className={`rounded-xl p-2.5 ${iconClass}`}>{icon}</span><div><h2 className="font-bold text-slate-800">{title}</h2><p className="text-sm text-slate-500">{subtitle}</p></div></div><div className="mt-5">{children}</div></article>; }
function ScoreCard({ label, value, tone }) { const colors = tone === "emerald" ? "border-emerald-100 bg-emerald-50 text-emerald-800" : "border-indigo-100 bg-indigo-50 text-indigo-800"; return <div className={`rounded-2xl border p-4 ${colors}`}><p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p><p className="mt-2 text-3xl font-bold">{value == null ? "—" : `${value}%`}</p><p className="mt-1 text-xs opacity-70">{value == null ? "Not provided" : "Submitted with thesis"}</p></div>; }
function DocumentLink({ href, label, secondary = false }) { return <a href={href} rel="noreferrer" target="_blank" className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${secondary ? "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100" : "bg-slate-900 text-white hover:bg-indigo-700"}`}><FileText size={16} />{label}<ExternalLink size={14} /></a>; }
function EmptyMessage({ text }) { return <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">{text}</p>; }
function Timeline({ timeline }) { return <Card icon={<Clock3 size={20} />} iconClass="bg-indigo-100 text-indigo-700" title="Thesis audit timeline" subtitle="Follow every milestone of your thesis journey"><div className="space-y-5">{timeline.map((item, index) => <div key={`${item.action}-${item.at}-${index}`} className="flex gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 size={16} /></span><div className="min-w-0 border-b border-slate-100 pb-5 last:border-0"><p className="text-sm font-semibold text-slate-800">{item.label}{item.position ? ` (Evaluator ${item.position})` : ""}</p><p className="mt-1 text-xs text-slate-500">{new Date(item.at).toLocaleString()}</p></div></div>)}{!timeline.length && <EmptyMessage text="No activity yet." />}</div></Card>; }
