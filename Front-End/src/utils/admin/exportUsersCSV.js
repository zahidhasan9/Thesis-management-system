export const exportUsersCSV = (users) => {
  const headers = ["Name", "Email", "Phone", "Role"];
  const rows = users.map((u) => [
    u.name || "",
    u.email || "",
    u.phone || "",
    u.role || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "users-report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};