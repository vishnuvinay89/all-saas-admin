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
        <EditIcon style={{ color: "rgba(0, 0, 0, 0.5)" }} />
      </Box>
       <Box
        onClick={() => {
          onDelete(rowData);
        }}
        style={{ cursor: "pointer" }}
      >
        <DeleteIcon style={{ color: "rgba(0, 0, 0, 0.5)" }} />
      </Box>
     
     
    </Box>
  );
};

export default ActionIcon;
