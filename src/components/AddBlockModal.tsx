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

interface AddBlockModalProps {
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

export const AddBlockModal: React.FC<AddBlockModalProps> = ({
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

  const [errors, setErrors] = useState({
    name: "",
    value: "",
    controllingField: "",
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
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const validate = () => {
    let valid = true;
    let errors = { name: "", value: "", controllingField: "" };

    if (!formData.name.trim()) {
      errors.name = t("COMMON.REQUIRED_FIELD");
      valid = false;
    }
    if (!formData.value.trim()) {
      errors.value = t("COMMON.REQUIRED_FIELD");
      valid = false;
    }
    if (!formData.controllingField.trim()) {
      errors.controllingField = t("COMMON.REQUIRED_FIELD");
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = () => {
    if (validate()) {
      const { name, value, controllingField } = formData;
      onSubmit(name, value, controllingField, fieldId, districtId);
      onClose();
    }
  };

  const isEditing = !!(
    initialValues.name ||
    initialValues.value ||
    initialValues.controllingField
  );
  const buttonText = isEditing ? t("COMMON.UPDATE") : t("COMMON.SUBMIT");
  const dialogTitle = isEditing
    ? t("COMMON.UPDATE_BLOCK")
    : t("COMMON.ADD_BLOCK");

  const buttonStyles = {
    fontSize: "14px",
    fontWeight: "500",
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: "14px" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label={t("COMMON.DISTRICT_NAME")}
          type="text"
          fullWidth
          variant="outlined"
          value={formData.controllingField}
          onChange={handleChange("controllingField")}
          error={!!errors.controllingField}
          helperText={errors.controllingField}
        />
        <TextField
          margin="dense"
          label={t("COMMON.BLOCK_NAME")}
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleChange("name")}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          margin="dense"
          label={t("COMMON.BLOCK_CODE")}
          type="text"
          fullWidth
          variant="outlined"
          value={formData.value}
          onChange={handleChange("value")}
          error={!!errors.value}
          helperText={errors.value}
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
          sx={{ ...buttonStyles, width: "auto", height: "40px" }}
          variant="contained"
          color="primary"
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
