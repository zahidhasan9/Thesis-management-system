import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  FileSearch,
  GraduationCap,
  Search,
  ShieldCheck,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import axios from "../../api/axios";

export default function PublicResults() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const lookup = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setResponse(null);
      const result = await axios.post("/public/results", { email, studentId });
      setResponse(result.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not verify results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster richColors position="top-right" />
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <ArrowLeft size={17} /> Home
          </button>
          <div className="flex items-center gap-2 text-gray-900">
            <GraduationCap size={22} />
            <span className="hidden font-semibold sm:inline">
              Thesis Management System
            </span>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
          >
            Login
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div>
            <div className="flex items-center gap-2 text-gray-900">
              <ShieldCheck size={22} />
              <h1 className="text-2xl font-semibold">Verify Published Result</h1>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Enter the email and Student ID used for registration. Only
              officially published results are available here.
            </p>

            <form
              onSubmit={lookup}
              className="mt-6 rounded-md border border-gray-200 bg-white p-5 shadow-sm"
            >
              <label className="block text-sm font-medium text-gray-700">
                Student Email
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="student@example.com"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-gray-500"
                />
              </label>
              <label className="mt-4 block text-sm font-medium text-gray-700">
                Student ID
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={studentId}
                  onChange={(event) => setStudentId(event.target.value)}
                  placeholder="Enter Student ID"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2.5 font-normal outline-none focus:border-gray-500"
                />
              </label>
              <button
                disabled={loading}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                <Search size={16} />
                {loading ? "Checking..." : "Verify Results"}
              </button>
            </form>
          </div>

          <ResultPanel response={response} loading={loading} />
        </section>
      </div>
    </main>
  );
}

function ResultPanel({ response, loading }) {
  if (loading) {
    return (
      <div className="rounded-md border border-gray-200 bg-white p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-100" />
          <div className="h-24 rounded bg-gray-100" />
          <div className="h-24 rounded bg-gray-100" />
        </div>
      </div>
    );
  }
  if (!response) {
    return (
      <div className="grid min-h-72 place-items-center rounded-md border border-dashed border-gray-300 bg-white p-8 text-center">
        <div>
          <FileSearch className="mx-auto text-gray-400" size={36} />
          <p className="mt-3 font-medium text-gray-700">
            Published results will appear here
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Individual evaluator marks and confidential comments are not public.
          </p>
        </div>
      </div>
    );
  }
  if (!response.results?.length) {
    return (
      <div className="grid min-h-72 place-items-center rounded-md border border-gray-200 bg-white p-8 text-center">
        <div>
          <FileSearch className="mx-auto text-gray-400" size={36} />
          <p className="mt-3 font-medium text-gray-800">No published result found</p>
          <p className="mt-1 text-sm text-gray-500">{response.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase text-gray-500">Verified Student</p>
          <h2 className="mt-1 text-xl font-semibold text-gray-900">
            {response.student?.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            ID: {response.student?.studentId}
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          <CheckCircle2 size={14} /> Published records
        </span>
      </div>

      <div className="hidden overflow-x-auto rounded-md border border-gray-200 bg-white md:block">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Thesis</th>
              <th className="px-4 py-3">Supervisor</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Published</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {response.results.map((result) => (
              <tr key={result.projectId}>
                <td className="px-4 py-4">
                  <p className="font-medium text-gray-900">{result.title}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {result.projectId}
                  </p>
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {result.supervisor?.name || "-"}
                </td>
                <td className="px-4 py-4 text-xl font-semibold text-gray-900">
                  {result.grade}
                </td>
                <td className="px-4 py-4 text-gray-600">
                  {formatDate(result.publishedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {response.results.map((result) => (
          <article
            key={result.projectId}
            className="rounded-md border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-semibold text-gray-900">
                  {result.title}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {result.supervisor?.name || "No supervisor"}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xl font-semibold">
                <Award size={18} /> {result.grade}
              </span>
            </div>
            <p className="mt-3 break-all text-xs text-gray-400">
              {result.projectId}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Published {formatDate(result.publishedAt)}
            </p>
            {result.feedback && (
              <p className="mt-3 border-t pt-3 text-sm leading-6 text-gray-600">
                {result.feedback}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "-";
}
