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
    <div className="min-w-0 rounded-3xl border border-white bg-white/90 p-4 shadow-xl shadow-indigo-100/60 sm:p-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Thesis Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Filter, export, view details, and manage thesis submissions
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-3">
          <select
            value={thesisStatusFilter}
            onChange={(e) => setThesisStatusFilter(e.target.value)}
            className="col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:col-span-1"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={onExportCSV}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </button>

          <button
            onClick={onExportPDF}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2.5 text-sm font-medium text-white hover:from-indigo-700 hover:to-violet-700"
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
