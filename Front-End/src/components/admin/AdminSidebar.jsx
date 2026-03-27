import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  handleLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "users", label: "Users", icon: Users },
    { key: "thesis", label: "Thesis", icon: FileText },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Admin Portal</h2>
            <p className="text-xs text-gray-500">Thesis Management</p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 min-h-screen bg-white border-r border-gray-200 flex-col justify-between">
        <div className="p-6">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Admin Portal</h2>
            <p className="text-sm text-gray-500 mt-1">
              Thesis Management System
            </p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                    active
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white transition px-4 py-3 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 border-r border-gray-200 shadow-xl transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Admin Portal</h2>
              <p className="text-sm text-gray-500 mt-1">
                Thesis Management System
              </p>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg border border-gray-300 text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => handleTabChange(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                    active
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white transition px-4 py-3 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}