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
    icon: React.ElementType;
  }[];

  showIcons?: boolean;
}

const ActionCell: React.FC<ActionCellProps> = ({
  rowData,
  extraActions,
  showIcons = true,
}) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {extraActions?.map((action, index) => (
          <>
            <Divider />
            <MenuItem
              sx={{ fontSize: "small" }}
              onClick={() => {
                action.onClick(rowData);
                handleClose();
              }}
            >
              {showIcons ? (
                <ListItemIcon>
                  <action.icon fontSize="small" />
                </ListItemIcon>
              ) : (
                ""
              )}
              <ListItemText primary={t(action.name)} />
            </MenuItem>
          </>
        ))}
      </Menu>
    </Box>
  );
};

export default ActionCell;
