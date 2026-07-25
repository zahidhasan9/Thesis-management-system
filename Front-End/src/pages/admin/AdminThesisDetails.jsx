import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  LockOpen,
  Mail,
  RefreshCw,
  Save,
  Send,
  UserCheck,
  XCircle,
  Download,
  History,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import axios from "../../api/axios";
import { exportEvaluationPDF } from "../../utils/admin/exportEvaluationPDF";

const statusStyle = {
  accepted: "bg-emerald-100 text-emerald-700",
  evaluation_pending: "bg-blue-100 text-blue-700",
  mark_submitted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-700",
  reassigned: "bg-gray-100 text-gray-700",
  unassigned: "bg-gray-100 text-gray-600",
};

export default function AdminThesisDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState(null);
  const [theses, setTheses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [supervisorId, setSupervisorId] = useState("");
  const [evaluatorIds, setEvaluatorIds] = useState(["", ""]);
  const [thirdId, setThirdId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [dialog, setDialog] = useState(null);

  const load = useCallback(async () => {
    try {
      const [detailRes, listRes, staffRes, auditRes] = await Promise.all([
        axios.get(`/admin/thesis/${id}`),
        axios.get("/admin/thesis"),
        axios.get("/admin/eligible-staff"),
        axios.get(`/admin/thesis/${id}/audit`),
      ]);
      const item = detailRes.data;
      setThesis(item);
      setTheses(listRes.data || []);
      setStaff(staffRes.data || []);
      setAudit(auditRes.data || []);
      setSupervisorId(item.supervisor?._id || "");
      const assigned = [...(item.evaluatorAssignments || [])].sort(
        (a, b) => a.position - b.position,
      );
      setEvaluatorIds(
        [1, 2].map(
          (position) =>
            assigned.find((a) => a.position === position)?.evaluator?._id || "",
        ),
      );
      setThirdId(
        assigned.find((a) => a.position === 3)?.evaluator?._id || "",
      );
      const currentDeadline =
        assigned.find((a) => a.deadline)?.deadline ||
        item.supervisorRequest?.deadline;
      setDeadline(
        currentDeadline
          ? new Date(currentDeadline).toISOString().slice(0, 16)
          : "",
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load evaluation");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const assignments = useMemo(
    () =>
      [...(thesis?.evaluatorAssignments || [])].sort(
        (a, b) => a.position - b.position,
      ),
    [thesis],
  );
  const selectedIds = new Set(
    [supervisorId, ...evaluatorIds, thirdId].filter(Boolean),
  );
  const options = (current) =>
    staff.filter(
      (person) => !selectedIds.has(person._id) || person._id === current,
    );
  const first = assignments.find((item) => item.position === 1);
  const second = assignments.find((item) => item.position === 2);
  const markDifference =
    first?.mark != null && second?.mark != null
      ? Math.abs(first.mark - second.mark)
      : null;

  const run = async (key, request, success) => {
    try {
      setBusy(key);
      const response = await request();
      toast.success(response.data.message || success);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setBusy("");
    }
  };

  const assignCore = () =>
    run(
      "core",
      () =>
        axios.patch(`/admin/thesis/${id}/assign-reviewers`, {
          supervisorId,
          evaluatorIds,
          deadline: deadline || undefined,
        }),
      "Review team assigned",
    );

  const requireThird = (reason) =>
    run(
      "require-third",
      () => axios.patch(`/admin/thesis/${id}/require-third`, { reason }),
      "Third evaluation required",
    );

  const assignThird = () =>
    run(
      "third",
      () =>
        axios.patch(`/admin/thesis/${id}/assign-third`, {
          evaluatorId: thirdId,
          deadline: deadline || undefined,
        }),
      "Third Evaluator assigned",
    );

  const resend = (position) =>
    run(
      `resend-${position}`,
      () =>
        axios.post(`/admin/thesis/${id}/resend-assignment`, { position }),
      "Email sent",
    );

  const unlock = (position, reason) =>
    run(
      `unlock-${position}`,
      () =>
        axios.patch(`/admin/thesis/${id}/marks/${position}/unlock`, {
          reason,
        }),
      "Mark unlocked",
    );

  const chooseThesis = (thesisId) => {
    if (thesisId && thesisId !== id) navigate(`/admin/thesis/${thesisId}`);
  };

  if (loading)
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 text-gray-600">
        Loading evaluation management...
      </div>
    );
  if (!thesis)
    return <div className="min-h-screen grid place-items-center">Thesis not found</div>;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <Toaster richColors position="top-right" />
      <div className="mx-auto max-w-7xl space-y-6">
        <button
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={17} /> Admin Dashboard
        </button>

        <section className="border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-semibold text-gray-900">
            Thesis Evaluation Management
          </h1>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Select
              label="Project ID"
              value={id}
              onChange={chooseThesis}
              items={theses.map((item) => ({
                value: item._id,
                label: item._id,
              }))}
            />
            <Select
              label="Thesis Title"
              value={id}
              onChange={chooseThesis}
              items={theses.map((item) => ({
                value: item._id,
                label: item.title,
              }))}
            />
          </div>
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Project ID" value={thesis._id} />
            <Info label="Student" value={thesis.student?.name} />
            <Info label="Student ID" value={thesis.student?.idNo} />
            <Info label="Publication" value={thesis.finalMarkStatus || "pending"} />
          </div>
        </section>

        {thesis.thirdEvaluatorRequired && (
          <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900">
            <AlertTriangle className="mt-0.5 shrink-0" size={20} />
            <div>
              <p className="font-semibold">Third Evaluator Required</p>
              <p className="mt-1 text-sm">
                {thesis.thirdEvaluatorRequirementReason ||
                  "A third evaluation is required before the final mark can be calculated."}
              </p>
            </div>
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <UserCheck size={20} />
              <h2 className="text-lg font-semibold">Faculty Assignment</h2>
            </div>
            <FacultySelect
              label="Supervisor"
              value={supervisorId}
              onChange={setSupervisorId}
              options={options(supervisorId)}
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {evaluatorIds.map((value, index) => (
                <FacultySelect
                  key={index}
                  label={`${index === 0 ? "First" : "Second"} Evaluator`}
                  value={value}
                  onChange={(next) =>
                    setEvaluatorIds((old) =>
                      old.map((item, itemIndex) =>
                        itemIndex === index ? next : item,
                      ),
                    )
                  }
                  options={options(value)}
                />
              ))}
            </div>
            <label className="mt-4 block text-sm font-medium text-gray-700">
              Evaluation Deadline
              <input
                type="datetime-local"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 p-2.5 font-normal"
              />
            </label>
            <button
              disabled={
                busy === "core" ||
                !supervisorId ||
                evaluatorIds.some((value) => !value)
              }
              onClick={assignCore}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm text-white disabled:opacity-50"
            >
              <Save size={16} />
              {busy === "core" ? "Saving..." : "Save & Send Requests"}
            </button>

            <div className="mt-6 border-t pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">Third Evaluator</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    The system determines necessity; Admin selects the person.
                  </p>
                </div>
                {!thesis.thirdEvaluatorRequired && (
                  <button
                    onClick={() =>
                      setDialog({
                        title: "Require Third Evaluation",
                        label: "Reason",
                        confirm: requireThird,
                      })
                    }
                    className="rounded-md border border-amber-300 px-3 py-2 text-sm text-amber-800"
                  >
                    Require Third Evaluation
                  </button>
                )}
              </div>
              {thesis.thirdEvaluatorRequired && (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <FacultySelect
                      label="Third Evaluator"
                      value={thirdId}
                      onChange={setThirdId}
                      options={options(thirdId)}
                    />
                  </div>
                  <button
                    disabled={!thirdId || busy === "third"}
                    onClick={assignThird}
                    className="h-[42px] rounded-md bg-gray-900 px-4 text-sm text-white disabled:opacity-50"
                  >
                    {busy === "third" ? "Assigning..." : "Assign Third Evaluator"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Assignment Status</h2>
            <div className="mt-4 space-y-1">
              <StatusRow
                label="Supervisor"
                name={thesis.supervisor?.name}
                status={thesis.supervisorRequest?.status || "unassigned"}
                reason={thesis.supervisorRequest?.rejectionReason}
                respondedAt={thesis.supervisorRequest?.respondedAt}
                email={thesis.supervisorRequest?.emailDelivery}
                onResend={() => resend("supervisor")}
                busy={busy === "resend-supervisor"}
              />
              {assignments.map((assignment) => (
                <StatusRow
                  key={assignment._id}
                  label={`${["First", "Second", "Third"][assignment.position - 1]} Evaluator`}
                  name={assignment.evaluator?.name}
                  status={assignment.status}
                  reason={assignment.rejectionReason}
                  respondedAt={assignment.respondedAt}
                  email={assignment.emailDelivery}
                  onResend={() => resend(assignment.position)}
                  busy={busy === `resend-${assignment.position}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Marks & Final Result</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="p-3">Role</th>
                  <th className="p-3">Evaluator</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Mark</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3">Comment</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id} className="border-t">
                    <td className="p-3">
                      {["First", "Second", "Third"][assignment.position - 1]} Evaluator
                    </td>
                    <td className="p-3">{assignment.evaluator?.name}</td>
                    <td className="p-3 capitalize">
                      {assignment.status.replaceAll("_", " ")}
                    </td>
                    <td className="p-3 font-semibold">
                      {assignment.mark ?? "Pending"}
                    </td>
                    <td className="p-3">
                      {assignment.submittedAt
                        ? new Date(assignment.submittedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="max-w-xs p-3">
                      {assignment.feedback || "-"}
                    </td>
                    <td className="p-3">
                      {assignment.markLocked && (
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              setDialog({
                                title: `Unlock ${["First", "Second", "Third"][assignment.position - 1]} Evaluator Mark`,
                                label: "Reason",
                                confirm: (reason) =>
                                  unlock(assignment.position, reason),
                              })
                            }
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-700"
                          >
                            <LockOpen size={14} /> Unlock
                          </button>
                          <button
                            onClick={() =>
                              setDialog({
                                type: "correction",
                                title: "Correct Submitted Mark",
                                currentMark: assignment.mark,
                                confirm: (mark, reason) =>
                                  run(
                                    `correct-${assignment.position}`,
                                    () =>
                                      axios.patch(
                                        `/admin/thesis/${id}/marks/${assignment.position}/correct`,
                                        { mark, reason },
                                      ),
                                    "Mark corrected",
                                  ),
                              })
                            }
                            className="text-xs font-medium text-blue-700"
                          >
                            Correct
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 grid gap-3 border-t pt-5 sm:grid-cols-2 lg:grid-cols-6">
            <Info label="Difference" value={markDifference ?? "Pending"} />
            <Info label="Threshold" value={thesis.evaluationThreshold ?? 10} />
            <Info
              label="Third Required"
              value={thesis.thirdEvaluatorRequired ? "Yes" : "No"}
            />
            <Info
              label="Best Two"
              value={thesis.bestTwoMarks?.length ? thesis.bestTwoMarks.join(", ") : "Pending"}
            />
            <Info label="Final Mark" value={thesis.finalMark ?? "Pending"} />
            <Info label="Result Status" value={thesis.finalMarkStatus || "pending"} />
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <ActionButton
              icon={Download}
              label="Evaluation PDF"
              onClick={() => exportEvaluationPDF(thesis)}
            />
            <ActionButton
              icon={Mail}
              label="Run Reminders"
              disabled={Boolean(busy)}
              onClick={() =>
                run(
                  "reminders",
                  () => axios.post("/admin/evaluation-reminders/run"),
                  "Reminders processed",
                )
              }
            />
            <ActionButton
              icon={RefreshCw}
              label="Recalculate"
              disabled={Boolean(busy)}
              onClick={() =>
                run(
                  "recalculate",
                  () => axios.post(`/admin/thesis/${id}/recalculate`),
                  "Final mark recalculated",
                )
              }
            />
            <ActionButton
              icon={CheckCircle2}
              label="Approve Final Mark"
              disabled={Boolean(busy) || thesis.finalMarkStatus !== "calculated"}
              onClick={() =>
                setDialog({
                  title: "Approve Final Mark",
                  message: `Approve final mark ${thesis.finalMark}?`,
                  confirm: () =>
                    run(
                      "approve",
                      () => axios.patch(`/admin/thesis/${id}/approve`),
                      "Final mark approved",
                    ),
                })
              }
            />
            <ActionButton
              icon={Send}
              label="Publish Result"
              primary
              disabled={Boolean(busy) || thesis.finalMarkStatus !== "approved"}
              onClick={() =>
                setDialog({
                  title: "Publish Student Result",
                  message:
                    "This will make the final mark visible to the student.",
                  confirm: () =>
                    run(
                      "publish",
                      () => axios.patch(`/admin/thesis/${id}/publish`),
                      "Result published",
                    ),
                })
              }
            />
            <ActionButton
              icon={Send}
              label="Publish Student Feedback"
              disabled={Boolean(busy)}
              onClick={() =>
                setDialog({
                  title: "Publish Approved Feedback",
                  label: "Feedback visible to the student",
                  confirm: (feedback) =>
                    run(
                      "student-feedback",
                      () =>
                        axios.patch(`/admin/thesis/${id}/student-feedback`, {
                          feedback,
                        }),
                      "Student feedback published",
                    ),
                })
              }
            />
          </div>
        </section>

        <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <History size={19} />
            <h2 className="text-lg font-semibold">Audit Timeline</h2>
          </div>
          <div className="mt-4 divide-y">
            {audit.length ? (
              audit.map((entry) => (
                <div
                  key={entry._id}
                  className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"
                >
                  <p className="text-xs text-gray-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {entry.action.replaceAll("_", " ")}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {entry.performedBy?.name || "System"} ·{" "}
                      {entry.performedByRole || "system"}
                    </p>
                    {entry.reason && (
                      <p className="mt-1 text-xs text-gray-700">
                        Reason: {entry.reason}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">
                No audit entries yet.
              </p>
            )}
          </div>
        </section>
      </div>
      {dialog &&
        (dialog.type === "correction" ? (
          <CorrectionDialog {...dialog} onClose={() => setDialog(null)} />
        ) : dialog.label ? (
          <ReasonDialog {...dialog} onClose={() => setDialog(null)} />
        ) : (
          <ConfirmDialog {...dialog} onClose={() => setDialog(null)} />
        ))}
    </main>
  );
}

function FacultySelect({ label, value, onChange, options }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-gray-300 p-2.5 font-normal"
      >
        <option value="">Select faculty</option>
        {options.map((person) => (
          <option key={person._id} value={person._id}>
            {person.name} | {person.department || "No department"} |{" "}
            {person.position || person.role} | workload {person.currentWorkload ?? 0}
          </option>
        ))}
      </select>
    </label>
  );
}

function Select({ label, value, onChange, items }) {
  return (
    <label className="text-sm font-medium text-gray-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 block w-full rounded-md border border-gray-300 p-2.5 font-normal"
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Info({ label, value }) {
  return (
    <div className="min-w-0 rounded-md border border-gray-200 bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 break-words font-medium capitalize text-gray-900">
        {value || "Not available"}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  name,
  status,
  reason,
  respondedAt,
  email,
  onResend,
  busy,
}) {
  const Icon =
    status === "rejected"
      ? XCircle
      : ["accepted", "mark_submitted", "completed"].includes(status)
        ? CheckCircle2
        : Clock3;
  return (
    <div className="border-b border-gray-100 py-3 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-500">{label}</p>
          <p className="font-medium text-gray-900">{name || "Not assigned"}</p>
          {respondedAt && (
            <p className="mt-1 text-xs text-gray-500">
              Responded {new Date(respondedAt).toLocaleString()}
            </p>
          )}
          {reason && <p className="mt-1 text-xs text-red-700">Reason: {reason}</p>}
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle[status] || statusStyle.unassigned}`}
        >
          <Icon size={14} />
          {status.replaceAll("_", " ")}
        </span>
      </div>
      {name && (
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Email: {email?.status?.replaceAll("_", " ") || "not sent"}
          </span>
          <button
            disabled={busy}
            onClick={onResend}
            className="inline-flex items-center gap-1 font-medium text-gray-700 disabled:opacity-50"
          >
            <Mail size={13} /> {busy ? "Sending..." : "Resend"}
          </button>
        </div>
      )}
    </div>
  );
}

function ActionButton({ icon, label, onClick, disabled, primary }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium disabled:opacity-40 ${
        primary
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-300 bg-white text-gray-700"
      }`}
    >
      {createElement(icon, { size: 16 })} {label}
    </button>
  );
}

function ReasonDialog({ title, label, confirm, onClose }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-md bg-white p-5 shadow-xl">
        <h2 className="text-lg font-semibold">{title}</h2>
        <label className="mt-4 block text-sm font-medium text-gray-700">
          {label}
          <textarea
            autoFocus
            rows="4"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="mt-2 w-full rounded-md border p-3 font-normal"
          />
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            disabled={reason.trim().length < 5}
            onClick={() => {
              confirm(reason.trim());
              onClose();
            }}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ title, message, confirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-md bg-white p-5 shadow-xl">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">{message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={() => {
              confirm();
              onClose();
            }}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function CorrectionDialog({ title, currentMark, confirm, onClose }) {
  const [mark, setMark] = useState(currentMark ?? "");
  const [reason, setReason] = useState("");
  const validMark = Number(mark) >= 0 && Number(mark) <= 100;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-md bg-white p-5 shadow-xl">
        <h2 className="text-lg font-semibold">{title}</h2>
        <label className="mt-4 block text-sm font-medium">
          Corrected mark
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={mark}
            onChange={(event) => setMark(event.target.value)}
            className="mt-2 block w-full rounded-md border p-2.5 font-normal"
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Correction reason
          <textarea
            rows="3"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="mt-2 block w-full rounded-md border p-2.5 font-normal"
          />
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            disabled={!validMark || reason.trim().length < 5}
            onClick={() => {
              confirm(Number(mark), reason.trim());
              onClose();
            }}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Save Correction
          </button>
        </div>
      </div>
    </div>
  );
}
