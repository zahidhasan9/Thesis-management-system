import { MaterialReactTable } from "material-react-table";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function ThesisTable({ thesis, onDelete }) {
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "student.idNo",
        header: "ID",
        size: 200,
        Cell: ({ cell }) => (
          <Typography variant="body2" className="text-gray-500">
            {/* #{cell.getValue().slice(-6)} */}
             #{cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "title",
        header: "Thesis",
        size: 300,
        Cell: ({ cell }) => (
          <Typography className="font-semibold text-gray-800">
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "student.name",
        header: "Student",
        size: 200,
        Cell: ({ cell }) => (
        //   <Chip
        //     label={cell.getValue()}
        //     color="primary"
        //     variant="outlined"
        //     className="font-medium"
        //   />
           <Typography className="font-semibold text-gray-800">
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: "pdf",
        header: "File",
        size: 150,
        Cell: ({ cell }) => (
          <Button
            variant="outlined"
            size="small"
            startIcon={<PictureAsPdfIcon />}
            onClick={() =>
              window.open(
                `http://localhost:5000/${cell.getValue().replace(/\\/g, "/")}`,
                "_blank"
              )
            }
          >
            View
          </Button>
        ),
      },
      {
        header: "Actions",
        size: 200,
        Cell: ({ row }) => (
          <Box className="flex gap-2">
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => navigate(`/admin/thesis/${row.original._id}`)}
              className="rounded-lg"
            >
              View
            </Button>

            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(row.original._id)}
              className="rounded-lg"
            >
              Delete
            </Button>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <MaterialReactTable
  columns={columns}
  data={thesis}
  enableRowNumbers
  enableColumnFilters
  enablePagination
  enableSorting

  muiTableHeadCellProps={{
    sx: {
      fontWeight: "bold",
      fontSize: "14px",
      backgroundColor: "#f1f5f9", // soft gray (tailwind slate-100)
      color: "#1e293b",
    },
  }}

  muiTableBodyRowProps={{
    sx: {
      "&:hover": {
        backgroundColor: "#f9fafb", // hover effect
        cursor: "pointer",
      },
    },
  }}

  muiTableBodyCellProps={{
    sx: {
      fontSize: "14px",
      color: "#374151",
    },
  }}

  muiTableContainerProps={{
    sx: {
      borderRadius: "12px",
    },
  }}
/>
    </div>
  );
}