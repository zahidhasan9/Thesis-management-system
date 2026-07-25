import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function NotificationCenter() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    try {
      const response = await axios.get("/notifications?limit=30");
      setItems(response.data.notifications || []);
      setUnread(response.data.unread || 0);
    } catch {
      // The rest of the portal remains usable if notifications are unavailable.
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(load, 0);
    const interval = window.setInterval(load, 60000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [load]);

  useEffect(() => {
    const close = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const openItem = async (item) => {
    if (!item.readAt) {
      await axios.patch(`/notifications/${item._id}/read`);
      setUnread((count) => Math.max(0, count - 1));
    }
    setOpen(false);
    if (item.link) navigate(item.link);
  };

  const markAllRead = async () => {
    await axios.patch("/notifications/read-all");
    setItems((current) =>
      current.map((item) => ({ ...item, readAt: item.readAt || new Date() })),
    );
    setUnread(0);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-10 w-10 place-items-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        title="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1 text-center text-[11px] font-semibold leading-5 text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b p-3">
            <p className="font-semibold text-gray-900">Notifications</p>
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-600"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length ? (
              items.map((item) => (
                <button
                  key={item._id}
                  onClick={() => openItem(item)}
                  className={`block w-full border-b p-3 text-left hover:bg-gray-50 ${
                    item.readAt ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    {item.message}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </button>
              ))
            ) : (
              <p className="p-8 text-center text-sm text-gray-500">
                No notifications yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
