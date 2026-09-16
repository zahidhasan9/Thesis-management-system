import { X } from "lucide-react";

export default function EditRoleModal({
  showModal,
  editUser,
  newRole,
  setNewRole,
  closeModal,
  saveRole,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Edit User Role
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {editUser?.name || "User"}
            </p>
          </div>

          <button
            onClick={closeModal}
            className="rounded-xl p-2 text-gray-500 hover:bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Role
          </label>

          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
            <option value="evaluator">Evaluator</option>
            <option value="third_evaluator">Third Evaluator</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              className="rounded-xl bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-white hover:from-indigo-700 hover:to-violet-700"
              onClick={saveRole}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
