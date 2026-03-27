export const exportThesisCSV = (thesisList = []) => {
  const headers = ["Title", "Student", "Status", "Final Mark", "Created At"];

  const rows = thesisList.map((t) => [
    t?.title || "",
    t?.student?.name || "",
    t?.status || "",
    t?.finalMark ?? "",
    t?.createdAt
      ? new Date(t.createdAt).toLocaleDateString("en-GB")
      : "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "thesis-report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};