import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import axios from "../../api/axios";
import AuthPageShell from "../../components/AuthPageShell";

export default function VerifyEmailSent() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [loading, setLoading] = useState(false);

  const resend = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/auth/resend-verification", {
        email,
      });

      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Verification email could not be sent"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Check your email"
      description="We sent an email verification link. Verify your address, then wait for administrator approval before logging in."
      footer={
        <Link className="font-semibold text-blue-600" to="/login">
          Back to login
        </Link>
      }
    >
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-800">
        The link expires in 24 hours. Check the spam or junk folder when it is
        not visible in your inbox.
      </div>

      <form className="mt-6 space-y-4" onSubmit={resend}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input
            autoComplete="email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>

        <button
          className="w-full rounded-xl border border-blue-600 px-4 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Sending..." : "Resend verification email"}
        </button>
      </form>
    </AuthPageShell>
  );
}
