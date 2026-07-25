import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Trash2,
} from "lucide-react";

const PAGE_SIZE = 10;
const API_URL = "http://localhost:5000";

export default function ThesisTable({
  thesis = [],
  onDelete,
  onViewDetails,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(thesis.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return thesis.slice(start, start + PAGE_SIZE);
  }, [safePage, thesis]);

  const openPdf = (path) => {
    if (!path) return;
    window.open(`${API_URL}/${path.replace(/\\/g, "/")}`, "_blank");
  };

  if (!thesis.length) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 px-4 py-12 text-center">
        <FileText className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-3 text-sm font-medium text-gray-700">
          No thesis records found
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Try changing the selected status filter.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div className="hidden overflow-x-auto rounded-md border border-gray-200 md:block">
        <table className="w-full min-w-[860px] table-fixed text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="w-[120px] px-4 py-3 font-semibold">Student ID</th>
              <th className="w-[30%] px-4 py-3 font-semibold">Thesis</th>
              <th className="w-[18%] px-4 py-3 font-semibold">Student</th>
              <th className="w-[120px] px-4 py-3 font-semibold">Status</th>
              <th className="w-[90px] px-4 py-3 font-semibold">File</th>
              <th className="w-[150px] px-4 py-3 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600">
                  {item.student?.idNo || "-"}
                </td>
                <td className="px-4 py-3">
                  <p className="line-clamp-2 break-words font-medium text-gray-900">
                    {item.title || "Untitled thesis"}
                  </p>
                  <p className="mt-1 truncate text-xs text-gray-400">
                    {item._id}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <p className="truncate">{item.student?.name || "-"}</p>
                  <p className="mt-1 truncate text-xs text-gray-400">
                    {item.student?.email || ""}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openPdf(item.pdf)}
                    disabled={!item.pdf}
                    className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 disabled:text-gray-300"
                  >
                    <FileText size={15} /> PDF
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(item._id)}
                      className="grid h-9 w-9 place-items-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                      title="View thesis"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="grid h-9 w-9 place-items-center rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                      title="Delete thesis"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((item) => (
          <article
            key={item._id}
            className="rounded-md border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-semibold text-gray-900">
                  {item.title || "Untitled thesis"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {item.student?.name || "Unknown student"} ·{" "}
                  {item.student?.idNo || "No ID"}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-3 break-all text-xs text-gray-400">{item._id}</p>
            <div className="mt-4 flex items-center gap-2 border-t pt-3">
              <button
                onClick={() => onViewDetails(item._id)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm text-white"
              >
                <Eye size={15} /> View
              </button>
              <button
                onClick={() => openPdf(item.pdf)}
                disabled={!item.pdf}
                className="grid h-9 w-9 place-items-center rounded-md border border-gray-300 text-gray-700 disabled:opacity-40"
                title="Open PDF"
              >
                <FileText size={15} />
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="grid h-9 w-9 place-items-center rounded-md border border-red-200 text-red-600"
                title="Delete thesis"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <Pagination
        page={safePage}
        totalPages={totalPages}
        totalItems={thesis.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

function StatusBadge({ status = "pending" }) {
  const colors = {
    accepted: "bg-emerald-100 text-emerald-700",
    completed: "bg-blue-100 text-blue-700",
    declined: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function Pagination({ page, totalPages, totalItems, onPageChange }) {
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, totalItems);
  return (
    <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        Showing {start}-{end} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="grid h-9 w-9 place-items-center rounded-md border border-gray-300 text-gray-600 disabled:opacity-40"
          title="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="min-w-20 text-center text-sm font-medium text-gray-700">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="grid h-9 w-9 place-items-center rounded-md border border-gray-300 text-gray-600 disabled:opacity-40"
          title="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
