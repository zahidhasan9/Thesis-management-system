import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "sonner";
import { CalendarDays, Save, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function SubmissionDeadlineCard() {
  const [deadline, setDeadline] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatForInput = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
  };

  const loadSetting = async () => {
    try {
      const res = await axios.get("/admin/submission-setting");

      setDeadline(formatForInput(res.data.deadline));
      setIsActive(res.data.isActive ?? false);
      setIsOpen(res.data.isOpen ?? false);
    } catch {
      toast.error("Failed to load submission deadline");
    }
  };

  useEffect(() => {
    loadSetting();
  }, []);

  const handleSave = async () => {
    if (!deadline) {
      toast.error("Please select deadline date and time");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.patch("/admin/submission-setting", {
        deadline,
        isActive,
      });

      toast.success(res.data.message || "Deadline updated");
      loadSetting();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update deadline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-5 h-5 text-gray-600" />

            <h2 className="text-xl font-semibold text-gray-800">
              Thesis Submission Deadline
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            Admin can set the last date and time for student thesis submission.
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
            isOpen
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isOpen ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}

          {isOpen ? "Submission Open" : "Submission Closed"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Date & Time
          </label>

          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Submission Status
          </label>

          <select
            value={isActive ? "active" : "inactive"}
            onChange={(e) => setIsActive(e.target.value === "active")}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="active">Active</option>
            <option value="inactive">Closed Manually</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-5 inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition disabled:bg-gray-400"
      >
        <Save className="w-4 h-4" />
        {loading ? "Saving..." : "Save Deadline"}
      </button>
    </div>
  );
}