import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportUsersPDF = (users = []) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Users Report", 14, 15);

  autoTable(doc, {
    startY: 22,
    head: [["Name", "Email", "Phone", "Role"]],
    body: users.map((u) => [
      u?.name || "",
      u?.email || "",
      u?.phone || "",
      u?.role || "",
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [31, 41, 55],
    },
  });

  doc.save("users-report.pdf");
};