import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import axios from "../../api/axios";
import AuthPageShell from "../../components/AuthPageShell";

export default function VerifyEmail() {
  const { token } = useParams();
  const requestStarted = useRef(false);
  const [state, setState] = useState({
    loading: true,
    success: false,
    message: "Verifying your email...",
  });

  useEffect(() => {
    if (!token || requestStarted.current) {
      return;
    }

    requestStarted.current = true;

    axios
      .post(`/auth/verify-email/${token}`)
      .then((response) => {
        setState({
          loading: false,
          success: true,
          message: response.data.message,
        });
      })
      .catch((error) => {
        setState({
          loading: false,
          success: false,
          message:
            error.response?.data?.message ||
            "Email verification could not be completed.",
        });
      });
  }, [token]);

  return (
    <AuthPageShell
      title="Email verification"
      description="We are checking the secure verification link."
      footer={
        <Link className="font-semibold text-blue-600" to="/login">
          Go to login
        </Link>
      }
    >
      <div
        className={`rounded-2xl border p-6 text-sm leading-7 ${
          state.loading
            ? "border-blue-200 bg-blue-50 text-blue-800"
            : state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
        }`}
      >
        <div className="font-semibold">
          {state.loading
            ? "Please wait"
            : state.success
              ? "Verification completed"
              : "Verification failed"}
        </div>
        <p className="mt-2">{state.message}</p>
      </div>

      {!state.loading && !state.success ? (
        <Link
          className="mt-5 block w-full rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          to="/verify-email-sent"
        >
          Request a new verification link
        </Link>
      ) : null}
    </AuthPageShell>
  );
}
