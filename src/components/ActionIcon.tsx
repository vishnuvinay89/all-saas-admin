// components/ActionCell.tsx

import React from "react";
import { Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface ActionCellProps {
  onEdit: (rowData: any) => void;
  onDelete: (rowData: any) => void;
  rowData: any;
}

const ActionIcon: React.FC<ActionCellProps> = ({
  rowData,
  onEdit,
  onDelete,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <Box
        onClick={() => {
          onEdit(rowData);
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          opacity: 0.5, // Reduced opacity to make it appear disabled
          pointerEvents: "auto", // Enable pointer events to allow click
        }}
      >
        <EditIcon sx={{ color: "rgba(0, 0, 0, 0.5)" }} />
        <Typography variant="body2">
          Edit
        </Typography>
      </Box>
      <Box
        onClick={() => {
          onDelete(rowData);
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <DeleteIcon sx={{ color: "rgba(0, 0, 0, 0.5)" }} />
        <Typography variant="body2">
          Delete
        </Typography>
      </Box>
    </Box>
  );
};

export default ActionIcon;
