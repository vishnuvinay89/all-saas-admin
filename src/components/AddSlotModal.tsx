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
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "next-i18next";

interface AddSlotModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    value: string,
  ) => void;
  initialValues?: {
    name?: string;
    value?: string;
  };
}

export const AddSlotModal: React.FC<AddSlotModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues = {},
}) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || "",
    value: initialValues.value || "",
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [districts, setDistricts] = useState<
    { value: string; label: string }[]
  >([]);


  const { t } = useTranslation();

  useEffect(() => {
    setFormData({
      name: initialValues.name || "",
      value: initialValues.value || "",
      // cohortId:cohortIdAddNew
    });

    setErrors({});
  }, [initialValues]);


  function transformLabels(label: string) {
    if (!label || typeof label !== "string") return "";
    return label
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const validateField = (
    field: keyof typeof formData,
    value: string,
    requiredMessage: string
  ) => {
    if (!value) return requiredMessage;
   
    if (field === "name" && !/^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)\s?-\s?(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/.test(value))
      return t("COMMON.INVALID_TEXT");

    const isUnique = (fieldName: string, value: string) => {
      return true;
    };

    if (field === "name" && !isUnique("name", value)) {
      return t("COMMON.BLOCK_NAME_NOT_UNIQUE");
    }

    if (field === "value" && !isUnique("value", value)) {
      return t("COMMON.BLOCK_CODE_NOT_UNIQUE");
    }

    return null;
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      let value = typeof e.target.value === "string" ? e.target.value : "";

      if (field === "value") {
        value = value.toUpperCase().slice(0, 3);
      }
      setFormData((prev) => ({ ...prev, [field]: value }));

      let errorMessage: string | null = null;

      if (field === "name") {
        errorMessage = validateField(
          field,
          value,
          t("COMMON.NAME_REQUIRED")
        );
      } else if (field === "value") {
        errorMessage = validateField(
          field,
          value,
          t("COMMON.CODE_REQUIRED")
        );
      } 
      setErrors((prev) => ({
        ...prev,
        [field]: errorMessage,
      }));
    };

  const validateForm = () => {
    const newErrors = {
      name: validateField(
        "name",
        formData.name,
        t("COMMON.NAME_REQUIRED")
      ),
      value: validateField(
        "value",
        formData.value,
        t("COMMON.CODE_REQUIRED")
      )
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== null);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(
        formData.name,
        formData.value,
      );
      setFormData({
        name: "",
        value: "",
      });
      onClose();
    }
  };

  const isEditing = !!initialValues.name;
  const buttonText = isEditing ? t("COMMON.UPDATE") : t("COMMON.SUBMIT");
  const dialogTitle = isEditing
    ? t("COMMON.UPDATE_SLOT")
    : t("COMMON.ADD_SLOT");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: "14px" }}>{dialogTitle}</DialogTitle>
      <Divider />
      <DialogContent>
        <TextField
          margin="dense"
          label={t("COMMON.SLOT_NAME")}
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
          label={t("COMMON.SLOT_CODE")}
          type="text"
          fullWidth
          variant="outlined"
          value={formData.value}
          onChange={handleChange("value")}
          error={!!errors.value}
          helperText={errors.value}
          disabled={isEditing}
        />
        <Box display="flex" alignItems="center" mt={2}>
          <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="caption" color="textSecondary">
            {t("COMMON.CODE_NOTIFICATION")}
          </Typography>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
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
          variant="contained"
          sx={{ fontSize: "14px" }}
          color="primary"
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
