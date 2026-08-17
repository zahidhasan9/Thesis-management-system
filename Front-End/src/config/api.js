export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

export const fileUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = String(path).replace(/\\/g, "/").replace(/^\/+/, "");
  return `${API_ORIGIN}/${cleanPath}`;
};
