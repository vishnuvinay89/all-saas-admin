// components/ActionCell.tsx

import React from "react";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface ActionCellProps {
  rowData: any;
  onEdit: (rowData: any) => void;
  onDelete: (rowData: any) => void;
}

const ActionCell: React.FC<ActionCellProps> = ({
  rowData,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(rowData);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(rowData);
    handleClose();
  };

  return (
    <Box>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem sx={{ fontSize: "small" }} onClick={handleEdit}>
          Edit
        </MenuItem>
        <Divider />
        <MenuItem sx={{ fontSize: "small" }} onClick={handleDelete}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ActionCell;
