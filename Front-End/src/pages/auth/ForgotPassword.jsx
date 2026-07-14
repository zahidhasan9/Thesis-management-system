import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import axios from "../../api/axios";
import AuthPageShell from "../../components/AuthPageShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/auth/forgot-password", {
        email,
      });

      setSent(true);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Password reset email could not be sent",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Forgot Password?"
      description="Enter your registered email address and we will send you a secure password reset link."
      footer={
        <Link
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          to="/login"
        >
          ← Back to login
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-5 text-emerald-700">
          Check your inbox and spam folder. If your email is registered, you
          will receive a password reset link.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleForgotPassword}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Email Address
            </span>

            <input
              autoComplete="email"
              className="
                h-11
                w-full
                rounded-lg
                border
                border-slate-300
                px-3
                text-sm
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              value={email}
              placeholder="Enter your email"
            />
          </label>

          <button
            className="
              h-11
              w-full
              rounded-lg
              bg-blue-600
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
            disabled={loading}
            type="submit"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthPageShell>
  );
}
