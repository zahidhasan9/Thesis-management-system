import { ChevronDown } from "lucide-react";

export default function AdminHeader({
  activeTab,
  fetchData,
  currentUser,
  handleLogout,
  dropdownRef,
  showProfileDropdown,
  setShowProfileDropdown,
}) {
  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500 mb-1">Administrative Overview</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 capitalize">
          {activeTab}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Manage users, monitor thesis progress, and review system activity.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={fetchData}
          className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Refresh Data
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfileDropdown((prev) => !prev)}
            className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-semibold">
              {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-800">
                {currentUser?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser?.email || "admin@email.com"}
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">
                  {currentUser?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentUser?.email || "admin@email.com"}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  Role: {currentUser?.role || "admin"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}