import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import axios from "../../api/axios";
import AuthPageShell from "../../components/AuthPageShell";

const initialForm = {
  name: "",
  idNo: "",
  email: "",
  phone: "",
  password: "",
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const register = async (event) => {
    event.preventDefault();

    if (Object.values(form).some((value) => !value.trim())) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must contain at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/auth/register", form);

      toast.success(response.data.message);

      navigate(
        `/verify-email-sent?email=${encodeURIComponent(
          form.email.trim().toLowerCase(),
        )}`,
        { replace: true },
      );
    } catch (error) {
      const data = error.response?.data;

      toast.error(data?.message || "Registration failed");

      if (data?.code === "EMAIL_NOT_VERIFIED") {
        navigate(
          `/verify-email-sent?email=${encodeURIComponent(
            form.email.trim().toLowerCase(),
          )}`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Create Account"
      description="Register as a student and verify your email before account activation."
      footer={
        <>
          <span className="text-sm text-slate-600">
            Already have an account?{" "}
          </span>

          <Link
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            to="/login"
          >
            Login
          </Link>
        </>
      }
    >
      <form className="space-y-3" onSubmit={register}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Full Name
          </span>

          <input
            autoComplete="name"
            className="
          h-10
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
            name="name"
            onChange={updateField}
            required
            type="text"
            value={form.name}
            placeholder="Enter full name"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            ID Number
          </span>

          <input
            className="
          h-10
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
            name="idNo"
            onChange={updateField}
            required
            type="text"
            value={form.idNo}
            placeholder="Enter ID number"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Email Address
          </span>

          <input
            autoComplete="email"
            className="
          h-10
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
            name="email"
            onChange={updateField}
            required
            type="email"
            value={form.email}
            placeholder="Enter email"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Phone Number
          </span>

          <input
            autoComplete="tel"
            className="
          h-10
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
            name="phone"
            onChange={updateField}
            required
            type="tel"
            value={form.phone}
            placeholder="Enter phone number"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </span>

          <input
            autoComplete="new-password"
            className="
          h-10
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
            minLength={8}
            name="password"
            onChange={updateField}
            required
            type="password"
            value={form.password}
            placeholder="Create password"
          />

          <span className="mt-1 block text-xs text-slate-500">
            Minimum 8 characters required.
          </span>
        </label>

        <button
          className="
        mt-1
        h-10
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
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </AuthPageShell>
  );
}
