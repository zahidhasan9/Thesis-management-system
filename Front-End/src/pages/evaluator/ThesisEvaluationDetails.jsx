import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import Navbar from "../../components/Navbar";
import { toast } from "sonner";
import StatusBadge from "../../components/evaluator/StatusBadge";

export default function ThesisEvaluationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [thesis, setThesis] = useState(null);
  const [mark, setMark] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const isThirdEvaluator = role === "third_evaluator";

  const navItems = [{ name: "Profile", route: "/profile" }];

  const fetchThesis = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/evaluator/thesis/${id}`);
      setThesis(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch thesis details");
    } finally {
      setLoading(false);
    }
  };

  console.log("Thesis details:", thesis);

  useEffect(() => {
    fetchThesis();
  }, [id]);

  const diff = useMemo(() => {
    if (!thesis?.evaluatorMarks || thesis.evaluatorMarks.length !== 2) return 0;
    return Math.abs(thesis.evaluatorMarks[0].mark - thesis.evaluatorMarks[1].mark);
  }, [thesis]);

  const isConflict = diff > 14;
  const canSubmit = thesis?.status !== "completed" && thesis?.status !== "declined";

  const handleSubmit = async () => {
    if (mark === "" || mark === undefined || isNaN(mark)) {
      toast.error("Enter a valid mark");
      return;
    }

    const numericMark = Number(mark);

    if (numericMark < 0 || numericMark > 100) {
      toast.error("Mark must be between 0 and 100");
      return;
    }

    try {
      setSubmitting(true);

      const endpoint = isThirdEvaluator
        ? "/evaluator/submit-third-mark"
        : "/evaluator/submit-mark";

      const res = await axios.post(endpoint, {
        thesisId: id,
        mark: numericMark,
      });

      toast.success(res.data?.message || "Mark submitted successfully");
      setMark("");
      fetchThesis();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit mark");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar
        items={navItems}
        portal={isThirdEvaluator ? "Third Evaluator Portal" : "Evaluator Portal"}
      />

      <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Back
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-center text-slate-500">Loading thesis details...</p>
          </div>
        ) : !thesis ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-center text-slate-500">No thesis found.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">{thesis.title}</h1>
                  <p className="mt-2 text-slate-600">
                    Review thesis information and submit evaluation from this page.
                  </p>
                </div>

                <StatusBadge
                  status={thesis.status}
                  isConflict={isConflict}
                  isThirdEvaluator={isThirdEvaluator}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-slate-800">Student Information</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p><span className="font-semibold text-slate-700">Name:</span> {thesis.student?.name || "N/A"}</p>
                    <p><span className="font-semibold text-slate-700">Student ID:</span> {thesis.student?.idNo || "N/A"}</p>
                    <p><span className="font-semibold text-slate-700">Department:</span> {thesis.student?.department || "N/A"}</p>
                    <p><span className="font-semibold text-slate-700">Department:</span> {thesis.student?.Section || "N/A"}</p>
        
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-slate-800">Evaluation Summary</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p><span className="font-semibold text-slate-700">Status:</span> {thesis.status}</p>
                    <p><span className="font-semibold text-slate-700">Final Mark:</span> {thesis.finalMark ?? "N/A"}</p>
                    <p><span className="font-semibold text-slate-700">Difference:</span> {thesis.evaluatorMarks?.length === 2 ? diff : "N/A"}</p>
                  </div>
                </div>
              </div>

              {thesis.evaluatorMarks?.length > 0 && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-slate-800">
                    Evaluator Marks
                  </h3>

                  <div className="space-y-2 text-sm text-slate-600">
                    {thesis.evaluatorMarks.map((item, index) => (
                      <p key={index}>
                        <span className="font-semibold text-slate-700">
                          Evaluator {index + 1}:
                        </span>{" "}
                        {item.mark}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {thesis.fileUrl && (
                <div className="mt-6">
                  <a
                    href={thesis.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    View Thesis File
                  </a>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800">Submit Evaluation</h2>
              <p className="mt-2 text-sm text-slate-600">
                Enter the evaluation mark for this thesis.
              </p>

              {!canSubmit ? (
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  {thesis.status === "completed"
                    ? "This thesis has already been completed."
                    : "This thesis has been declined and cannot be evaluated."}
                </div>
              ) : (
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Enter Mark
                  </label>

                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={mark}
                    onChange={(e) => setMark(e.target.value)}
                    placeholder="0 - 100"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Evaluation"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}