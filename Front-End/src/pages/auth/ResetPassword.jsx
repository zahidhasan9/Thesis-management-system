import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import axios from "../../api/axios";
import AuthPageShell from "../../components/AuthPageShell";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const resetPassword = async (event) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      localStorage.removeItem("user");
      setCompleted(true);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Create a new password"
      description="Choose a new password for your account. This secure link can only be used once."
      footer={
        <Link className="font-semibold text-blue-600" to="/login">
          Back to login
        </Link>
      }
    >
      {completed ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">
            Your password has been changed successfully.
          </div>

          <Link
            className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            to="/login"
          >
            Login with new password
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={resetPassword}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              New password
            </span>
            <input
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirm new password
            </span>
            <input
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              minLength={8}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              type="password"
              value={confirmPassword}
            />
          </label>

          <button
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Changing password..." : "Change password"}
          </button>
        </form>
      )}
    </AuthPageShell>
  );
}
