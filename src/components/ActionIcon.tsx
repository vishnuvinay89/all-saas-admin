// components/ActionCell.tsx

import React from "react";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
// import EditIcon from '@mui/icons-material/ModeEditOutlineOutlined';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from "next-i18next";
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
      }}
    >
      <Box
        onClick={() => {
          onEdit(rowData);
        }}
        style={{
          cursor: "pointer",
          opacity: 0.5, // Reduced opacity to make it appear disabled
          pointerEvents: "auto", // Enable pointer events to allow click
        }}
      >
        <Tooltip title={t("COMMON.EDIT")}>
          <EditIcon style={{ color: "rgba(0, 0, 0, 0.5)" }} />
        </Tooltip>
      </Box>
      <Box
        onClick={() => {
          onDelete(rowData);
        }}
        style={{ cursor: "pointer" }}
      >
        <Tooltip title={t("COMMON.DELETE")}>
          <DeleteIcon style={{ color: "rgba(0, 0, 0, 0.5)" }} />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ActionIcon;
