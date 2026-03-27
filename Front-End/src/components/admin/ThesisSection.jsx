import { FileSpreadsheet, FileDown } from "lucide-react";
import ThesisTable from "../../pages/admin/ThesisTable";

export default function ThesisSection({
  thesisStatusFilter,
  setThesisStatusFilter,
  filteredThesis,
  handleDeleteThesis,
  onViewDetails,
  onExportCSV,
  onExportPDF,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Thesis Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Filter, export, view details, and manage thesis submissions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <select
            value={thesisStatusFilter}
            onChange={(e) => setThesisStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={onExportCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-sm hover:bg-gray-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </button>

          <button
            onClick={onExportPDF}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-black"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      <ThesisTable
        thesis={filteredThesis}
        onDelete={handleDeleteThesis}
        onViewDetails={onViewDetails}
      />
    </div>
  );
}