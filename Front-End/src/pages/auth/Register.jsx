import { Link } from "react-router-dom";
import AuthPageShell from "../../components/AuthPageShell";

const options = [
  { title: "Student Registration", description: "Create a student account using your student ID.", to: "/register/student", color: "border-blue-200 bg-blue-50 hover:border-blue-500" },
  { title: "Teacher Registration", description: "Create a teacher account for thesis supervision.", to: "/register/teacher", color: "border-emerald-200 bg-emerald-50 hover:border-emerald-500" },
];

export default function Register() {
  return (
    <AuthPageShell title="Create Account" description="Choose the account type you want to register." footer={<span className="text-sm text-slate-600">Already have an account? <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/login">Login</Link></span>}>
      <div className="space-y-4">
        {options.map((option) => (
          <Link className={`block rounded-xl border-2 p-5 transition ${option.color}`} key={option.to} to={option.to}>
            <h2 className="font-semibold text-slate-900">{option.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{option.description}</p>
          </Link>
        ))}
      </div>
    </AuthPageShell>
  );
}
