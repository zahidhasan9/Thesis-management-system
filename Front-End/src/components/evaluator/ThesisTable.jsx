import { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Search,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const getMarkDifference = (thesis) => {
  if (!thesis?.evaluatorMarks || thesis.evaluatorMarks.length !== 2) {
    return null;
  }

  const firstMark = Number(thesis.evaluatorMarks[0]?.mark || 0);
  const secondMark = Number(thesis.evaluatorMarks[1]?.mark || 0);

  return Math.abs(firstMark - secondMark);
};

const isConflictCase = (thesis) => {
  const diff = getMarkDifference(thesis);
  return diff !== null && diff > 14;
};

const isCompleted = (thesis) => {
  return (
    thesis?.status === "completed" ||
    thesis?.finalMark !== null ||
    thesis?.thirdEvaluatorMark?.mark !== undefined
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ThesisTable({ theses = [], isThirdEvaluator = false }) {
  const navigate = useNavigate();

  const tableData = useMemo(() => {
    return theses.map((item, index) => ({
      ...item,
      sl: index + 1,
      titleText: item?.title || "Untitled Thesis",
      studentName: item?.student?.name || "N/A",
      studentId: item?.student?.idNo || "N/A",
      department: item?.student?.department || "N/A",
      batch: item?.student?.batch || "N/A",
      section: item?.student?.Section || "N/A",
      markDifference: getMarkDifference(item),
      conflictCase: isConflictCase(item),
      completedCase: isCompleted(item),
      assignedDate: formatDate(item?.createdAt),
      finalMarkDisplay:
        item?.finalMark ?? item?.thirdEvaluatorMark?.mark ?? "—",
    }));
  }, [theses]);

  const summary = useMemo(() => {
    const total = tableData.length;
    const completed = tableData.filter((t) => t.completedCase).length;
    const conflict = tableData.filter((t) => t.conflictCase).length;
    const pending = tableData.filter(
      (t) => !t.completedCase && t.status !== "declined"
    ).length;

    return { total, completed, conflict, pending };
  }, [tableData]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "sl",
        header: "SL",
        size: 60,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ cell }) => (
          <Typography sx={{ fontWeight: 800, color: "#64748b", fontSize: 13 }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "studentId",
        header: "Student ID",
        size: 145,
        filterVariant: "text",
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            size="small"
            sx={{
              fontWeight: 900,
              bgcolor: "#e0f2fe",
              color: "#0369a1",
              borderRadius: "10px",
              letterSpacing: ".2px",
            }}
          />
        ),
      },
      {
        accessorKey: "titleText",
        header: "Thesis Details",
        size: 390,
        filterVariant: "text",
        Cell: ({ row }) => {
          const thesis = row.original;

          return (
            <Box sx={{ py: 0.5 }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  color: "#0f172a",
                  fontSize: 13.5,
                  lineHeight: 1.4,
                }}
              >
                {thesis.titleText}
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 12,
                  mt: 0.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.5,
                }}
              >
                {thesis.description || "No description available"}
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "studentName",
        header: "Student",
        size: 190,
        filterVariant: "text",
        Cell: ({ row }) => (
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserRound size={16} color="#475569" />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "#1e293b",
                    fontSize: 13,
                  }}
                >
                  {row.original.studentName}
                </Typography>

                <Typography sx={{ color: "#64748b", fontSize: 12 }}>
                  ID: {row.original.studentId}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ),
      },
      {
        accessorKey: "department",
        header: "Department",
        size: 170,
        filterVariant: "select",
        Cell: ({ cell }) => (
          <Typography sx={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "batch",
        header: "Batch",
        size: 100,
        filterVariant: "select",
      },
      {
        accessorKey: "section",
        header: "Section",
        size: 100,
        filterVariant: "select",
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 145,
        filterVariant: "select",
        Cell: ({ row }) => (
          <StatusBadge
            status={row.original.status}
            isConflict={row.original.conflictCase}
            isThirdEvaluator={isThirdEvaluator}
          />
        ),
      },
      ...(isThirdEvaluator
        ? [
            {
              accessorFn: (row) =>
                row.evaluatorMarks?.length
                  ? row.evaluatorMarks
                      .map((item) => item?.mark)
                      .filter((mark) => mark !== undefined && mark !== null)
                      .join(", ")
                  : "—",
              id: "evaluatorMarksText",
              header: "Evaluator Marks",
              size: 165,
              enableColumnFilter: false,
              Cell: ({ row }) => {
                const marks = row.original.evaluatorMarks || [];

                if (!marks.length) {
                  return (
                    <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                      —
                    </Typography>
                  );
                }

                return (
                  <Stack direction="row" spacing={0.7} flexWrap="wrap">
                    {marks.map((item, index) => (
                      <Chip
                        key={`${row.original._id}-${index}`}
                        label={item?.mark ?? "—"}
                        size="small"
                        sx={{
                          fontWeight: 900,
                          bgcolor: "#f1f5f9",
                          color: "#334155",
                          borderRadius: "10px",
                        }}
                      />
                    ))}
                  </Stack>
                );
              },
            },
            {
              accessorKey: "markDifference",
              header: "Difference",
              size: 130,
              filterVariant: "range",
              Cell: ({ row }) => {
                const diff = row.original.markDifference;

                if (diff === null) {
                  return (
                    <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                      —
                    </Typography>
                  );
                }

                return (
                  <Chip
                    label={diff}
                    size="small"
                    sx={{
                      fontWeight: 900,
                      borderRadius: "10px",
                      bgcolor: row.original.conflictCase
                        ? "#fef3c7"
                        : "#dcfce7",
                      color: row.original.conflictCase
                        ? "#92400e"
                        : "#166534",
                    }}
                  />
                );
              },
            },
          ]
        : []),
      {
        accessorKey: "finalMarkDisplay",
        header: "Final Mark",
        size: 125,
        enableColumnFilter: false,
        Cell: ({ cell }) => (
          <Typography
            sx={{
              fontWeight: 900,
              color: cell.getValue() !== "—" ? "#047857" : "#94a3b8",
              fontSize: 13,
            }}
          >
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "assignedDate",
        header: "Date",
        size: 130,
        enableColumnFilter: false,
      },
      {
        id: "action",
        header: "Action",
        size: 120,
        enableColumnFilter: false,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) => (
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/evaluator/thesis/${row.original._id}`)}
            sx={{
              minWidth: "82px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "12px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#020617",
                boxShadow: "none",
              },
            }}
          >
            Review
          </Button>
        ),
      },
    ],
    [isThirdEvaluator, navigate]
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    getRowId: (row) => row._id,

    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableHiding: true,
    enableColumnResizing: true,
    enableStickyHeader: true,

    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      density: "compact",
      showGlobalFilter: true,
      columnPinning: {
        left: ["studentId"],
      },
      sorting: [{ id: "studentId", desc: false }],
    },

    muiSearchTextFieldProps: {
      placeholder: "Search by Student ID, title, name, department...",
      size: "small",
      variant: "outlined",
      InputProps: {
        startAdornment: <Search size={17} color="#94a3b8" className="mr-2" />,
      },
      sx: {
        minWidth: { xs: "100%", sm: "430px" },
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          bgcolor: "#ffffff",
        },
      },
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        bgcolor: "#ffffff",
      },
    },

    muiTopToolbarProps: {
      sx: {
        bgcolor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        px: 1.5,
        py: 1,
      },
    },

    muiBottomToolbarProps: {
      sx: {
        bgcolor: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
      },
    },

    muiTableContainerProps: {
      sx: {
        maxHeight: "68vh",
        overflowX: "auto",
      },
    },

    muiTableHeadCellProps: {
      sx: {
        bgcolor: "#f8fafc",
        color: "#475569",
        fontWeight: 900,
        fontSize: "12.5px",
        borderBottom: "1px solid #e2e8f0",
      },
    },

    muiTableBodyCellProps: {
      sx: {
        color: "#334155",
        fontSize: "13px",
        borderBottom: "1px solid #f1f5f9",
      },
    },

    muiTableBodyRowProps: ({ row }) => {
      const conflict = isThirdEvaluator && row.original.conflictCase;
      const completed = row.original.completedCase;

      return {
        sx: {
          bgcolor: conflict
            ? "rgba(245, 158, 11, 0.08)"
            : completed
            ? "rgba(16, 185, 129, 0.035)"
            : "#ffffff",
          "&:hover": {
            bgcolor: conflict ? "rgba(245, 158, 11, 0.15)" : "#f8fafc",
          },
        },
      };
    },

    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "16px",
            bgcolor: "#0f172a",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BookOpen size={20} />
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 900,
              color: "#0f172a",
              fontSize: 14,
              lineHeight: 1.2,
            }}
          >
            Assigned Thesis Records
          </Typography>

          <Typography sx={{ color: "#64748b", fontSize: 12 }}>
            Search by ID, filter records, and review thesis submissions
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Stack
          direction="row"
          spacing={1}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Chip
            label={`${summary.total} Total`}
            size="small"
            sx={{ fontWeight: 800, bgcolor: "#e0f2fe", color: "#0369a1" }}
          />

          <Chip
            label={`${summary.pending} Pending`}
            size="small"
            sx={{ fontWeight: 800, bgcolor: "#fef3c7", color: "#92400e" }}
          />

          <Chip
            label={`${summary.completed} Completed`}
            size="small"
            sx={{ fontWeight: 800, bgcolor: "#dcfce7", color: "#166534" }}
          />

          {isThirdEvaluator && (
            <Chip
              icon={<ShieldAlert size={14} />}
              label={`${summary.conflict} Conflict`}
              size="small"
              sx={{ fontWeight: 800, bgcolor: "#fae8ff", color: "#86198f" }}
            />
          )}
        </Stack>
      </Box>
    ),

    renderEmptyRowsFallback: () => (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            borderRadius: "20px",
            bgcolor: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GraduationCap size={32} color="#94a3b8" />
        </Box>

        <Typography sx={{ fontWeight: 900, color: "#334155", fontSize: 16 }}>
          No thesis found
        </Typography>

        <Typography sx={{ color: "#64748b", mt: 1, fontSize: 13 }}>
          Try searching by student ID, student name, thesis title, or department.
        </Typography>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}