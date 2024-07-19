// components/ActionCell.tsx

import React from "react";

// import EditIcon from '@mui/icons-material/ModeEditOutlineOutlined';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from "next-i18next";
import { Box, Typography, Tooltip } from "@mui/material";
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
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <Tooltip title={t("COMMON.EDIT")}>
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
          <Typography variant="body2">Edit</Typography>
        </Box>
      </Tooltip>
      <Tooltip title={t("COMMON.DELETE")}>
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
<DeleteIcon sx={{ color: "rgb(244, 67, 54)" }} />
          <Typography variant="body2">Delete</Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default ActionIcon;