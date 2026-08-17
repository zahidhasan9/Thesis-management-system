import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportEvaluationPDF = (thesis) => {
  const doc = new jsPDF();
  const assignments = [...(thesis.evaluatorAssignments || [])].sort(
    (a, b) => a.position - b.position,
  );
  doc.setFontSize(16);
  doc.text("Thesis Evaluation Report", 14, 16);
  doc.setFontSize(10);
  doc.text(`Project ID: ${thesis.projectId || thesis._id}`, 14, 24);
  doc.text(`Title: ${thesis.title || ""}`, 14, 30);
  doc.text(`Student: ${thesis.student?.name || ""}`, 14, 36);
  autoTable(doc, {
    startY: 43,
    head: [["Role", "Evaluator", "Status", "Mark", "Submitted"]],
    body: assignments.map((item) => [
      `${["First", "Second", "Third"][item.position - 1]} Evaluator`,
      item.evaluator?.name || "",
      item.status || "",
      item.mark ?? "",
      item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "",
    ]),
    headStyles: { fillColor: [31, 41, 55] },
    styles: { fontSize: 9 },
  });
  const y = doc.lastAutoTable.finalY + 10;
  doc.text(`Best two marks: ${(thesis.bestTwoMarks || []).join(", ")}`, 14, y);
  doc.text(`Final mark: ${thesis.finalMark ?? "Pending"}`, 14, y + 7);
  doc.text(`Result status: ${thesis.finalMarkStatus || "pending"}`, 14, y + 14);
  doc.save(`evaluation-${thesis.projectId || thesis._id}.pdf`);
};
