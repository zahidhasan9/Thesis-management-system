import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "../../api/axios";
import AuthPageShell from "../../components/AuthPageShell";
import DepartmentSelect from "../../components/DepartmentSelect";

const fieldClass = "h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export default function RegistrationForm({ accountType }) {
  const isTeacher = accountType === "teacher";
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", idNo: "", email: "", phone: "", department: "", position: "", password: "" });
  const [loading, setLoading] = useState(false);
  const updateField = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));

  const register = async (event) => {
    event.preventDefault();
    const required = ["name", "idNo", "email", "phone", "password"];
    required.push("department");
    if (isTeacher) required.push("position");
    if (required.some((field) => !form[field].trim())) return toast.error("Please fill in all required fields");
    if (form.password.length < 8) return toast.error("Password must contain at least 8 characters");

    setLoading(true);
    try {
      const response = await axios.post("/auth/register", { ...form, accountType });
      toast.success(response.data.message);
      navigate(`/verify-email-sent?email=${encodeURIComponent(form.email.trim().toLowerCase())}`, { replace: true });
    } catch (error) {
      const data = error.response?.data;
      toast.error(data?.message || "Registration failed");
      if (data?.code === "EMAIL_NOT_VERIFIED") navigate(`/verify-email-sent?email=${encodeURIComponent(form.email.trim().toLowerCase())}`);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text", autoComplete: "name" },
    { name: "idNo", label: isTeacher ? "Teacher ID" : "Student ID", type: "text" },
    { name: "email", label: "Email Address", type: "email", autoComplete: "email" },
    { name: "phone", label: "Phone Number", type: "tel", autoComplete: "tel" },
    { name: "department", label: "Department", type: "select" },
    ...(isTeacher ? [{ name: "position", label: "Designation", type: "text" }] : []),
    { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
  ];

  return (
    <AuthPageShell title={`${isTeacher ? "Teacher" : "Student"} Registration`} description={`Create your ${accountType} account and verify your email before admin approval.`} footer={<div className="flex justify-between text-sm"><Link className="font-semibold text-slate-600 hover:text-slate-900" to="/register">Change account type</Link><Link className="font-semibold text-blue-600 hover:text-blue-700" to="/login">Login</Link></div>}>
      <form className="space-y-3" onSubmit={register}>
        {fields.map((field) => (
          <label className="block" key={field.name}>
            <span className="mb-1 block text-sm font-medium text-slate-700">{field.label}</span>
            {field.type === "select" ? <DepartmentSelect className={fieldClass} onChange={updateField} required value={form.department} /> : <input autoComplete={field.autoComplete} className={fieldClass} minLength={field.name === "password" ? 8 : undefined} name={field.name} onChange={updateField} placeholder={`Enter ${field.label.toLowerCase()}`} required type={field.type} value={form[field.name]} />}
          </label>
        ))}
        <button className="mt-1 h-10 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading} type="submit">
          {loading ? "Creating Account..." : `Register as ${isTeacher ? "Teacher" : "Student"}`}
        </button>
      </form>
    </AuthPageShell>
  );
}
