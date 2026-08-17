import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FileDown,
  FileSpreadsheet,
  Eye,
  Search,
  ShieldCheck,
  UserCog,
  XCircle,
} from "lucide-react";
import { fileUrl } from "../../config/api";

function UserAvatar({ user, accent = "blue", large = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = user?.profileImage || user?.avatar;
  const size = large ? "h-12 w-12 text-lg" : "h-9 w-9 text-sm";
  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden rounded-full font-bold ${size} ${accent === "blue" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"}`}>
      {image && !imageFailed ? (
        <img
          alt={`${user?.name || "User"} profile`}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
          src={fileUrl(image)}
        />
      ) : (user?.name?.charAt(0)?.toUpperCase() || "U")}
    </span>
  );
}

const statusBadge = (status) => {
  if (status === "active") return <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800"><CheckCircle2 className="h-3.5 w-3.5" />Active</span>;
  if (status === "disabled") return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800"><XCircle className="h-3.5 w-3.5" />Disabled</span>;
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800"><Clock3 className="h-3.5 w-3.5" />Pending</span>;
};

const formatDeleteDate = (date) => date ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

function UserTable({ title, description, users, idLabel, emptyMessage, openEditModal, openViewModal, handleDelete, handleAccountStatus, allowRoleChange = true, accent = "blue" }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleUsers = useMemo(() => users.slice((safePage - 1) * pageSize, safePage * pageSize), [users, safePage]);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className={`flex items-center justify-between border-b px-5 py-4 ${accent === "blue" ? "border-blue-100 bg-blue-50/70" : "border-violet-100 bg-violet-50/70"}`}>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${accent === "blue" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"}`}>{users.length} users</span>
      </div>

      {users.length ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="border-b bg-gray-50/70 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">{idLabel}</th><th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Auto Delete</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr></thead>
              <tbody>{visibleUsers.map((user) => (
                <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80" key={user._id}>
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><UserAvatar accent={accent} user={user} /><span className="font-medium text-gray-800">{user.name || "-"}</span></div></td>
                  <td className="px-4 py-3 text-gray-600">{user.email || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{user.idNo || "-"}</td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700"><UserCog className="h-3.5 w-3.5" />{user.role?.replace("_", " ") || "-"}</span></td>
                  <td className="px-4 py-3">{statusBadge(user.status || "pending")}</td>
                  <td className="px-4 py-3 text-gray-600">{user.status === "active" ? "-" : formatDeleteDate(user.deleteAfter)}</td>
                  <td className="px-4 py-3"><div className="flex flex-wrap justify-end gap-2">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100" onClick={() => openViewModal(user)}><Eye className="h-3.5 w-3.5" />View</button>
                    {allowRoleChange && <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700" onClick={() => openEditModal(user)}>Edit Role</button>}
                    {user.status !== "active" ? <button className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700" onClick={() => handleAccountStatus(user._id, "active")}><ShieldCheck className="h-3.5 w-3.5" />Activate</button> : <button className="rounded-lg bg-yellow-600 px-3 py-1.5 text-xs text-white hover:bg-yellow-700" onClick={() => handleAccountStatus(user._id, "disabled")}>Disable</button>}
                    <button className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700" onClick={() => handleDelete(user._id)}>Delete</button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {totalPages > 1 && <div className="flex items-center justify-end gap-2 border-t px-4 py-3 text-sm">
            <button className="rounded border px-3 py-1 disabled:opacity-40" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>Previous</button>
            <span className="text-gray-600">Page {safePage} of {totalPages}</span>
            <button className="rounded border px-3 py-1 disabled:opacity-40" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}>Next</button>
          </div>}
        </>
      ) : <div className="p-8 text-center text-sm text-gray-500">{emptyMessage}</div>}
    </section>
  );
}

export default function UsersSection({ search, setSearch, filteredUsers, openEditModal, handleDelete, handleAccountStatus, onExportCSV, onExportPDF }) {
  const [viewUser, setViewUser] = useState(null);
  const [activeUserTab, setActiveUserTab] = useState("students");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const departments = useMemo(() => [...new Set(filteredUsers.map((user) => user.department).filter(Boolean))].sort(), [filteredUsers]);
  const departmentUsers = departmentFilter === "all" ? filteredUsers : filteredUsers.filter((user) => user.department === departmentFilter);
  const students = departmentUsers.filter((user) => user.role === "student");
  const otherUsers = departmentUsers.filter((user) => user.role !== "student");
  const tableProps = { openEditModal, openViewModal: setViewUser, handleDelete, handleAccountStatus };

  const detailRows = viewUser ? [
    ["Full Name", viewUser.name], ["Email", viewUser.email], ["Phone", viewUser.phone],
    ["ID Number", viewUser.idNo], ["Role", viewUser.role?.replace("_", " ")],
    ["Status", viewUser.status], ["Department", viewUser.department],
    ["Designation", viewUser.position], ["Batch", viewUser.batch],
    ["Section", viewUser.Section], ["University", viewUser.university],
    ["Email Verified", viewUser.isEmailVerified === false ? "No" : "Yes"],
    ["Registered", viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleString("en-GB") : null],
    ["Last Login", viewUser.lastLoginAt ? new Date(viewUser.lastLoginAt).toLocaleString("en-GB") : null],
  ] : [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div><h2 className="text-xl font-semibold text-gray-800">User Management</h2><p className="mt-1 text-sm text-gray-500">Students are separated from all other user accounts.</p></div>
        <div className="flex gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700" onClick={onExportCSV}><FileSpreadsheet className="h-4 w-4" />CSV</button><button className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700" onClick={onExportPDF}><FileDown className="h-4 w-4" />PDF</button></div>
      </div>
      <div className="mb-5 flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, email, ID, role or status..." type="text" value={search} /></div><select className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" onChange={(event) => setDepartmentFilter(event.target.value)} value={departmentFilter}><option value="all">All Departments</option>{departments.map((department) => <option key={department} value={department}>{department}</option>)}</select></div>
      <div className="mb-5 flex gap-2 overflow-x-auto border-b border-gray-200">
        <button
          className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-semibold transition ${activeUserTab === "students" ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800"}`}
          onClick={() => setActiveUserTab("students")}
          type="button"
        >
          Students <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{students.length}</span>
        </button>
        <button
          className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-semibold transition ${activeUserTab === "others" ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800"}`}
          onClick={() => setActiveUserTab("others")}
          type="button"
        >
          Teachers & Other Users <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">{otherUsers.length}</span>
        </button>
      </div>
      <div>
        {activeUserTab === "students" && <UserTable {...tableProps} accent="blue" allowRoleChange={false} description="Registered student accounts (role changes are disabled)" emptyMessage="No students matched your search." idLabel="Student ID" title="Students" users={students} />}
        {activeUserTab === "others" && <UserTable {...tableProps} accent="violet" description="Teacher, supervisor, evaluator and admin accounts" emptyMessage="No other users matched your search." idLabel="ID Number" title="Teachers & Other Users" users={otherUsers} />}
      </div>
      {viewUser && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={() => setViewUser(null)}>
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
          <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-5">
            <div className="flex items-center gap-3"><UserAvatar large user={viewUser} /><div><h3 className="text-lg font-semibold text-gray-900">User Information</h3><p className="text-sm text-gray-500">Complete account details</p></div></div>
            <button aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-xl text-gray-600 hover:bg-gray-200" onClick={() => setViewUser(null)}>×</button>
          </div>
          <div className="grid gap-x-8 gap-y-5 p-6 sm:grid-cols-2">
            {detailRows.map(([label, value]) => <div className="border-b border-gray-100 pb-3" key={label}><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p><p className="mt-1 break-words text-sm font-medium text-gray-800">{value || "Not provided"}</p></div>)}
          </div>
          <div className="flex justify-end border-t bg-gray-50 px-6 py-4"><button className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-black" onClick={() => setViewUser(null)}>Close</button></div>
        </div>
      </div>}
    </div>
  );
}
