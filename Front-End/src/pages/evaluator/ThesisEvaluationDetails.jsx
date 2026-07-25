import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, FileText, Send, X } from "lucide-react";
import { toast, Toaster } from "sonner";
import axios from "../../api/axios";

export default function ThesisEvaluationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState(null);
  const [mark, setMark] = useState("");
  const [feedback, setFeedback] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [useRubric, setUseRubric] = useState(false);
  const [rubric, setRubric] = useState({
    researchQuality: "",
    methodology: "",
    implementation: "",
    reportQuality: "",
    presentation: "",
  });
  const [confirmed, setConfirmed] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setThesis((await axios.get(`/evaluator/thesis/${id}`)).data); }
    catch (error) { toast.error(error.response?.data?.message || "Could not load assignment"); }
  }, [id]);
  useEffect(() => { load(); }, [load]);
  const assignment = thesis?.evaluatorAssignments?.[0];

  const respond = async (status, reason = "") => {
    try { setBusy(true); await axios.patch(`/evaluator/thesis/${id}/respond`, { status, rejectionReason: reason }); toast.success(`Assignment ${status}`); setShowReject(false); await load(); }
    catch (error) { toast.error(error.response?.data?.message || "Request failed"); }
    finally { setBusy(false); }
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!confirmed) return toast.error("Confirm the evaluation before submitting");
    try { setBusy(true); await axios.post("/evaluator/submit-mark", { thesisId: id, mark: Number(mark), rubric: useRubric ? rubric : undefined, feedback, recommendation }); toast.success("Evaluation submitted and locked"); await load(); }
    catch (error) { toast.error(error.response?.data?.message || "Submission failed"); }
    finally { setBusy(false); }
  };
  const pdfUrl = thesis?.pdf ? `http://localhost:5000/${thesis.pdf.replace(/\\/g, "/")}` : null;
  if (!thesis) return <div className="min-h-screen grid place-items-center bg-gray-50">Loading assignment...</div>;

  return <main className="min-h-screen bg-gray-50 px-4 py-8"><Toaster richColors />
    <div className="mx-auto max-w-4xl space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-600"><ArrowLeft size={17}/> Back</button>
      <header className="border-b pb-5"><p className="text-sm text-gray-500">Evaluator {assignment?.position} assignment</p><h1 className="mt-1 text-3xl font-semibold text-gray-900">{thesis.title}</h1><p className="mt-2 text-gray-600">Student: {thesis.student?.name}</p></header>
      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-5"><h2 className="font-semibold">Project information</h2><p className="mt-3 text-sm leading-6 text-gray-600">{thesis.description || "No description provided."}</p>{pdfUrl && <a href={pdfUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"><FileText size={16}/> View submitted PDF</a>}</div>
        <div className="rounded-lg border bg-white p-5"><h2 className="font-semibold">Assignment request</h2><p className="mt-2 text-sm text-gray-600">Current status: <span className="font-medium capitalize text-gray-900">{assignment?.status}</span></p>
          {assignment?.status === "pending" && <div className="mt-5 flex gap-3"><button disabled={busy} onClick={() => respond("accepted")} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm text-white"><Check size={16}/> Accept</button><button disabled={busy} onClick={() => setShowReject(true)} className="inline-flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm text-red-700"><X size={16}/> Reject</button></div>}
          {showReject && <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3"><label className="text-sm font-medium text-red-900">Rejection reason<textarea rows="3" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} className="mt-2 block w-full rounded-md border border-red-200 bg-white p-2 text-gray-900"/></label><div className="mt-3 flex justify-end gap-2"><button onClick={() => setShowReject(false)} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button><button disabled={rejectionReason.trim().length < 5 || busy} onClick={() => respond("rejected", rejectionReason.trim())} className="rounded-md bg-red-700 px-3 py-1.5 text-sm text-white disabled:opacity-40">Confirm rejection</button></div></div>}
        </div>
      </section>
      {["accepted", "evaluation_pending", "mark_submitted"].includes(assignment?.status) && <section className="rounded-lg border bg-white p-5"><h2 className="text-lg font-semibold">Submit confidential evaluation</h2><p className="mt-1 text-sm text-gray-500">Other evaluators cannot see your mark or comments.</p>
        {assignment.mark != null ? <div className="mt-5 rounded-md bg-emerald-50 p-4 text-emerald-800">Your submitted and locked mark: <strong>{assignment.mark}</strong>{assignment.feedback && <p className="mt-2 text-sm">{assignment.feedback}</p>}</div> : <form onSubmit={submit} className="mt-5 space-y-4"><div className="inline-flex rounded-md border p-1"><button type="button" onClick={() => setUseRubric(false)} className={`rounded px-3 py-1.5 text-sm ${!useRubric ? "bg-gray-900 text-white" : "text-gray-600"}`}>Total Mark</button><button type="button" onClick={() => setUseRubric(true)} className={`rounded px-3 py-1.5 text-sm ${useRubric ? "bg-gray-900 text-white" : "text-gray-600"}`}>Rubric</button></div>{useRubric ? <div className="grid gap-3 sm:grid-cols-2">{Object.entries({researchQuality:"Research Quality",methodology:"Methodology",implementation:"Implementation / Analysis",reportQuality:"Report Quality",presentation:"Presentation / Viva"}).map(([key,label]) => <label key={key} className="text-sm font-medium">{label} (0-20)<input type="number" min="0" max="20" step="0.01" required value={rubric[key]} onChange={(event) => setRubric((current) => ({...current,[key]:event.target.value}))} className="mt-2 block w-full rounded-md border p-2.5"/></label>)}<div className="rounded-md bg-gray-50 p-3 text-sm font-semibold">Rubric total: {Object.values(rubric).reduce((sum,value) => sum + (Number(value) || 0),0)} / 100</div></div> : <div><label className="text-sm font-medium">Mark (0-100)</label><input type="number" min="0" max="100" step="0.01" required value={mark} onChange={(e) => setMark(e.target.value)} className="mt-2 block w-full rounded-md border p-2.5"/></div>}<div><label className="text-sm font-medium">Feedback</label><textarea rows="5" value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mt-2 block w-full rounded-md border p-2.5" placeholder="Evaluation feedback"/></div><div><label className="text-sm font-medium">Recommendation</label><select value={recommendation} onChange={(event) => setRecommendation(event.target.value)} className="mt-2 block w-full rounded-md border p-2.5"><option value="">Select recommendation</option><option value="accept">Accept</option><option value="minor_revision">Minor revision</option><option value="major_revision">Major revision</option><option value="reject">Reject</option></select></div><label className="flex items-start gap-2 text-sm text-gray-700"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} className="mt-1"/>I confirm this evaluation is complete. The submitted mark will be locked.</label><button disabled={busy || !confirmed} className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm text-white disabled:opacity-40"><Send size={16}/>{busy ? "Submitting..." : "Submit evaluation"}</button></form>}
      </section>}
    </div>
  </main>;
}
