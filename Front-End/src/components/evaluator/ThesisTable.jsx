import { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ThesisTable({ theses, isThirdEvaluator }) {
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Thesis Title",
        size: 280,
      },
      {
        accessorFn: (row) => row.student?.name || "N/A",
        id: "studentName",
        header: "Student Name",
        size: 180,
      },
      {
        accessorFn: (row) => row.student?.idNo || "N/A",
        id: "studentId",
        header: "Student ID",
        size: 120,
      },
      {
        accessorFn: (row) => row.student?.department || "N/A",
        id: "department",
        header: "Department",
        size: 120,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        Cell: ({ row }) => {
          const thesis = row.original;
          const diff =
            thesis.evaluatorMarks?.length === 2
              ? Math.abs(thesis.evaluatorMarks[0].mark - thesis.evaluatorMarks[1].mark)
              : 0;
          const isConflict = diff > 14;

          return (
            <StatusBadge
              status={thesis.status}
              isConflict={isConflict}
              isThirdEvaluator={isThirdEvaluator}
            />
          );
        },
      },
      {
        accessorFn: (row) => {
          if (!row.evaluatorMarks || row.evaluatorMarks.length !== 2) return "—";
          const diff = Math.abs(row.evaluatorMarks[0].mark - row.evaluatorMarks[1].mark);
          return diff;
        },
        id: "difference",
        header: "Difference",
        size: 100,
      },
      {
        accessorFn: (row) => row.finalMark ?? "—",
        id: "finalMark",
        header: "Final Mark",
        size: 100,
      },
    ],
    [isThirdEvaluator]
  );

  const table = useMaterialReactTable({
    columns,
    data: theses,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableHiding: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      density: "compact",
      showGlobalFilter: true,
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: "65vh",
      },
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "8px" }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/evaluator/thesis/${row.original._id}`)}
        >
          View
        </Button>
      </Box>
    ),
    enableRowActions: true,
    positionActionsColumn: "last",
  });

  return <MaterialReactTable table={table} />;
}