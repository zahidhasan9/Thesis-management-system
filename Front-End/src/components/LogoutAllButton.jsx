import { MonitorX } from "lucide-react";
import axios from "../api/axios";

export default function LogoutAllButton() {
  const logoutAll = async () => {
    if (!window.confirm("Log out this account from every device?")) return;
    await axios.post("/auth/logout-all");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <button
      onClick={logoutAll}
      className="grid h-10 w-10 place-items-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      title="Log out from all devices"
    >
      <MonitorX size={18} />
    </button>
  );
}
