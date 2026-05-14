// import { Search, FileSpreadsheet, FileDown, UserCog } from "lucide-react";

// export default function UsersSection({
//   search,
//   setSearch,
//   userRoleFilter,
//   setUserRoleFilter,
//   filteredUsers,
//   openEditModal,
//   handleDelete,
//   onExportCSV,
//   onExportPDF,
// }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
//       <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
//         <div>
//           <h2 className="text-lg font-semibold text-gray-800">
//             User Management
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Search, filter, export, and manage users
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
//           <div className="relative w-full sm:w-72">
//             <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//             <input
//               placeholder="Search by name, email, or role"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
//             />
//           </div>

//           <select
//             value={userRoleFilter}
//             onChange={(e) => setUserRoleFilter(e.target.value)}
//             className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white"
//           >
//             <option value="all">All Roles</option>
//             <option value="student">Student</option>
//             <option value="supervisor">Supervisor</option>
//             <option value="admin">Admin</option>
//             <option value="evaluator">Evaluator</option>
//             <option value="third_evaluator">Third Evaluator</option>
//           </select>

//           <button
//             onClick={onExportCSV}
//             className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-sm hover:bg-gray-50"
//           >
//             <FileSpreadsheet className="w-4 h-4" />
//             CSV
//           </button>

//           <button
//             onClick={onExportPDF}
//             className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-black"
//           >
//             <FileDown className="w-4 h-4" />
//             PDF
//           </button>
//         </div>
//       </div>

//       {filteredUsers?.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-50 text-left">
//                 <th className="p-3 border-b text-sm font-semibold text-gray-700">
//                   Name
//                 </th>
//                 <th className="p-3 border-b text-sm font-semibold text-gray-700">
//                   Email
//                 </th>
//                 <th className="p-3 border-b text-sm font-semibold text-gray-700">
//                   Phone
//                 </th>
//                 <th className="p-3 border-b text-sm font-semibold text-gray-700">
//                   Role
//                 </th>
//                 <th className="p-3 border-b text-sm font-semibold text-gray-700">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.map((u) => (
//                 <tr key={u._id} className="hover:bg-gray-50 align-top">
//                   <td className="p-3 border-b text-sm text-gray-700">
//                     {u.name}
//                   </td>
//                   <td className="p-3 border-b text-sm text-gray-700 break-all">
//                     {u.email}
//                   </td>
//                   <td className="p-3 border-b text-sm text-gray-700">
//                     {u.phone || "-"}
//                   </td>
//                   <td className="p-3 border-b text-sm text-gray-700 capitalize">
//                     {u.role}
//                   </td>
//                   <td className="p-3 border-b">
//                     <div className="flex flex-wrap gap-2">
//                       <button
//                         className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-black text-sm"
//                         onClick={() => openEditModal(u)}
//                       >
//                         <UserCog className="w-4 h-4" />
//                         Edit Role
//                       </button>

//                       <button
//                         className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm"
//                         onClick={() => handleDelete(u._id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-sm text-gray-500">
//           No users matched your search.
//         </div>
//       )}
//     </div>
//   );
// }

import {
  Search,
  FileSpreadsheet,
  FileDown,
  UserCog,
  CheckCircle2,
  XCircle,
  Clock3,
  ShieldCheck,
} from "lucide-react";

export default function UsersSection({
  search,
  setSearch,
  userRoleFilter,
  setUserRoleFilter,
  filteredUsers,
  openEditModal,
  handleDelete,
  handleAccountStatus,
  onExportCSV,
  onExportPDF,
}) {
  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Active
        </span>
      );
    }

    if (status === "disabled") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          <XCircle className="w-3.5 h-3.5" />
          Disabled
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
        <Clock3 className="w-3.5 h-3.5" />
        Pending
      </span>
    );
  };

  const formatDeleteDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            User Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Approve, disable, delete, filter, and manage registered accounts.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </button>

          <button
            onClick={onExportPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Search by name, email, ID, role or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        <select
          value={userRoleFilter}
          onChange={(e) => setUserRoleFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
          <option value="evaluator">Evaluator</option>
          <option value="third_evaluator">Third Evaluator</option>
        </select>
      </div>

      {filteredUsers?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Student ID</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Auto Delete</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {u.name || "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-600">{u.email || "-"}</td>

                  <td className="px-4 py-3 text-gray-600">{u.idNo || "-"}</td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      <UserCog className="w-3.5 h-3.5" />
                      {u.role || "-"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {getStatusBadge(u.status || "pending")}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {u.status === "active" ? "-" : formatDeleteDate(u.deleteAfter)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition"
                      >
                        Edit Role
                      </button>

                      {u.status !== "active" && (
                        <button
                          onClick={() => handleAccountStatus(u._id, "active")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Activate
                        </button>
                      )}

                      {u.status === "active" && (
                        <button
                          onClick={() => handleAccountStatus(u._id, "disabled")}
                          className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs hover:bg-yellow-700 transition"
                        >
                          Disable
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(u._id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
          No users matched your search.
        </div>
      )}
    </div>
  );
}