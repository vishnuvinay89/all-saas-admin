// components/ActionCell.tsx

import React from "react";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from "next-i18next";
interface ActionCellProps {
  rowData: any;
  onEdit: (rowData: any) => void;
  onDelete: (rowData: any) => void;
  extraActions: {
    name: string;
    onClick: (rowData: any) => void;
  }[];
  showEdit?: boolean;
  showDelete?: boolean;
}

const ActionCell: React.FC<ActionCellProps> = ({
  rowData,
  onEdit,
  onDelete,
  extraActions,
  showEdit = true,
  showDelete = true,
}) => {
  const { t } = useTranslation();

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
        {showEdit && (
          <>
            {" "}
            <Divider />
            <MenuItem sx={{ fontSize: "small" }} onClick={handleEdit}>
              {t("ACTIONBUTONS.EDIT")}
            </MenuItem>
          </>
        )}
        {showDelete && (
          <>
            <Divider />
            <MenuItem sx={{ fontSize: "small" }} onClick={handleDelete}>
              {t("ACTIONBUTONS.DELETE")}
            </MenuItem>
          </>
        )}

        {extraActions?.map((action, index) => (
          <>
            <Divider />
            <MenuItem
              key={index}
              sx={{ fontSize: "small" }}
              onClick={() => {
                action.onClick(rowData);
                handleClose();
              }}
            >
              {t(action.name)}
            </MenuItem>
          </>
        ))}
      </Menu>
    </Box>
  );
};

export default ActionCell;
