import { ChevronDown, Sparkles } from "lucide-react";
import NotificationCenter from "../NotificationCenter";
import LogoutAllButton from "../LogoutAllButton";

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
    <div className="relative mb-8 flex flex-col gap-5 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-900 p-6 text-white shadow-xl shadow-indigo-200 lg:flex-row lg:items-center lg:justify-between sm:p-8">
      <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-white/10" />
      <div className="relative">
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-100"><Sparkles size={14} /> ADMIN WORKSPACE</p>
        <h1 className="text-2xl sm:text-3xl font-bold capitalize">
          {activeTab}
        </h1>
        <p className="mt-2 text-sm text-indigo-100">
          Manage users, monitor thesis progress, and review system activity.
        </p>
      </div>

      <div className="relative flex flex-wrap items-center gap-3">
        <NotificationCenter />
        <LogoutAllButton />
        <button
          onClick={fetchData}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Refresh Data
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowProfileDropdown((prev) => !prev)}
            className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white transition hover:bg-white/20"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-indigo-700">
              {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white">
                {currentUser?.name || "Admin"}
              </p>
              <p className="text-xs text-indigo-100">
                {currentUser?.email || "admin@email.com"}
              </p>
            </div>

            <ChevronDown className="w-4 h-4 text-indigo-100" />
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
