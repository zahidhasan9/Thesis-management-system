import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportThesisPDF = (thesisList = []) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Thesis Report", 14, 15);

  autoTable(doc, {
    startY: 22,
    head: [["Title", "Student", "Status", "Final Mark", "Created At"]],
    body: thesisList.map((t) => [
      t?.title || "",
      t?.student?.name || "",
      t?.status || "",
      t?.finalMark ?? "",
      t?.createdAt
        ? new Date(t.createdAt).toLocaleDateString("en-GB")
        : "",
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [31, 41, 55],
    },
  });

  doc.save("thesis-report.pdf");
};