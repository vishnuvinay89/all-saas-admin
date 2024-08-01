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
  const [formData, setFormData] = useState({
    name: initialValues.name || "",
    value: initialValues.value || "",
    controllingField: initialValues.controllingField || "",
  });

  const { t } = useTranslation();

  useEffect(() => {
    setFormData({
      name: initialValues.name || "",
      value: initialValues.value || "",
      controllingField: initialValues.controllingField || "",
    });
  }, [initialValues]);

  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = () => {
    const { name, value, controllingField } = formData;
    onSubmit(name, value, controllingField, fieldId, districtId);
    console.log(name, value, controllingField, fieldId, districtId);
    onClose();
  };

  const buttonStyles = {
    fontSize: "14px",
    fontWeight: "500",
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
          value={formData.controllingField}
          onChange={handleChange("controllingField")}
        />
        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleChange("name")}
        />
        <TextField
          margin="dense"
          label="Value"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.value}
          onChange={handleChange("value")}
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
            ...buttonStyles,
            color: "secondary",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
          variant="outlined"
        >
          {t("COMMON.CANCEL")}
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{ ...buttonStyles, width: "auto", height: "40px" }}
          variant="contained"
          color="primary"
        >
          {t("COMMON.SUBMIT")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
