import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import axios from "../../api/axios";
import AuthPageShell from "../../components/AuthPageShell";

const redirectByRole = (navigate, role) => {
  if (role === "student") navigate("/student", { replace: true });
  else if (role === "supervisor") navigate("/supervisor", { replace: true });
  else if (role === "evaluator" || role === "third_evaluator") {
    navigate("/evaluator", { replace: true });
  } else if (role === "admin") navigate("/admin", { replace: true });
};

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        redirectByRole(navigate, JSON.parse(storedUser).role);
      }
    } catch {
      localStorage.removeItem("user");
    }
  }, [navigate]);

  const login = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data));

      toast.success("Login successful");

      redirectByRole(navigate, response.data.role);
    } catch (error) {
      const data = error.response?.data;

      if (data?.code === "EMAIL_NOT_VERIFIED") {
        toast.error(data.message, {
          action: {
            label: "Resend",
            onClick: () =>
              navigate(
                `/verify-email-sent?email=${encodeURIComponent(
                  data.email || email.trim().toLowerCase(),
                )}`,
              ),
          },
        });
      } else {
        toast.error(data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Welcome Back"
      description="Login with your verified and approved account."
      footer={
        <>
          <span className="text-sm text-slate-600">
            Don't have an account?{" "}
          </span>

          <Link
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            to="/register"
          >
            Register
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={login}>
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
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
            placeholder="Enter your email"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </span>

          <input
            autoComplete="current-password"
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
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
            placeholder="Enter your password"
          />
        </label>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input
              checked={rememberMe}
              className="
              h-4
              w-4
              rounded
              border-slate-300
              "
              onChange={(event) => setRememberMe(event.target.checked)}
              type="checkbox"
            />
            Remember me
          </label>

          <Link
            className="
            font-semibold
            text-blue-600
            hover:text-blue-700
            "
            to="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>

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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthPageShell>
  );
}
