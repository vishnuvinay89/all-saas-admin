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

const validateInput = (input: string): boolean => /^[a-zA-Z]*$/.test(input);

const AddDistrictModal: React.FC<AddDistrictBlockModalProps> = ({
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
    name: null as string | null,
    value: null as string | null,
    controllingField: null as string | null,
  });

  const { t } = useTranslation();

  useEffect(() => {
    setFormData({
      name: initialValues.name || "",
      value: initialValues.value || "",
      controllingField: initialValues.controllingField || "",
    });
    setErrors({
      name: null,
      value: null,
      controllingField: null,
    });
  }, [initialValues]);

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const isValid = validateInput(value);
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({
        ...prev,
        [field]: isValid ? null : t("COMMON.INVALID_TEXT"),
      }));
    };

  const handleSubmit = () => {
    const { name, value, controllingField } = formData;
    let hasError = false;

    const newErrors = {
      name: name
        ? validateInput(name)
          ? null
          : t("COMMON.INVALID_TEXT")
        : t("COMMON.DISTRICT_NAME_REQUIRED"),
      value: value
        ? validateInput(value)
          ? null
          : t("COMMON.INVALID_TEXT")
        : t("COMMON.CODE_REQUIRED"),
      controllingField: controllingField
        ? validateInput(controllingField)
          ? null
          : t("COMMON.INVALID_TEXT")
        : t("COMMON.STATE_NAME_REQUIRED"),
    };

    setErrors(newErrors);

    hasError = Object.values(newErrors).some((error) => error !== null);

    if (!hasError) {
      onSubmit(name, value, controllingField, fieldId, districtId);
      setFormData({
        name: "",
        value: "",
        controllingField: "",
      });
      onClose();
    }
  };

  const isEditing = !!initialValues.name;
  const buttonText = isEditing ? t("COMMON.UPDATE") : t("COMMON.SUBMIT");
  const dialogTitle = isEditing
    ? t("COMMON.UPDATE_DISTRICT")
    : t("COMMON.ADD_DISTRICT");

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
          label={t("COMMON.STATE_NAME")}
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
          label={t("COMMON.DISTRICT_NAME")}
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
          label={t("COMMON.DISTRICT_CODE")}
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

export default AddDistrictModal;
