import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "next-i18next";

interface AddDistrictBlockModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    value: string,
    controllingField: string,
    fieldId: string,
    districtId?: string
  ) => void;
  fieldId: string;
  initialValues?: {
    name?: string;
    value?: string;
    controllingField?: string;
  };
  districtId?: string;
}

export const AddDistrictBlockModal: React.FC<AddDistrictBlockModalProps> = ({
  open,
  onClose,
  onSubmit,
  fieldId,
  initialValues = {},
  districtId,
}) => {
  const [name, setName] = useState<string>(initialValues.name || "");
  const [value, setValue] = useState<string>(initialValues.value || ""); 
  const [controllingField, setControllingField] = useState<string>(
    initialValues.controllingField || ""
  );
  const { t } = useTranslation();

  useEffect(() => {
    setName(initialValues.name || "");
    setValue(initialValues.value || "");
    setControllingField(initialValues.controllingField || "");
  }, [initialValues]);

  const handleSubmit = () => {
    onSubmit(name, value, controllingField, fieldId, districtId);
    console.log(name, value, controllingField, fieldId, districtId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("COMMON.ADD_DISTRICT")}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Controlling Field"
          type="text"
          fullWidth
          variant="outlined"
          value={controllingField}
          onChange={(e) => setControllingField(e.target.value)} 
        />
        <TextField
          margin="dense"
          label="Name" 
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
        <TextField
          margin="dense"
          label="Value"
          type="text"
          fullWidth
          variant="outlined"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Box display="flex" alignItems="center" mt={2}>
          <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="caption" color="textSecondary">
            {t("COMMON.CODE_NOTIFICATION")}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            border: "none",
            color: "secondary",
            fontSize: "14px",
            fontWeight: "500",
            "&:hover": {
              border: "none",
              backgroundColor: "transparent",
            },
          }}
          variant="outlined"
        >
          {t("COMMON.CANCEL")}
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            width: "auto",
            height: "40px",
            fontSize: "14px",
            fontWeight: "500",
          }}
          variant="contained"
          color="primary"
        >
          {t("COMMON.SUBMIT")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
