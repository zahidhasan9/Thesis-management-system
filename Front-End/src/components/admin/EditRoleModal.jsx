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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Edit User Role
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {editUser?.name || "User"}
            </p>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
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
            className="border border-gray-300 rounded-lg p-3 w-full mb-5 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="student">Student</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
            <option value="evaluator">Evaluator</option>
            <option value="third_evaluator">Third Evaluator</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black"
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