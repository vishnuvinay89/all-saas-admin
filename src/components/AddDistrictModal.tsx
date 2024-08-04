import React, { useState, useEffect, useCallback, useMemo } from "react";
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

const AddDistrictModal: React.FC<AddDistrictBlockModalProps> = ({
  open,
  onClose,
  onSubmit,
  fieldId,
  initialValues = {},
  districtId,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    controllingField: "",
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const { t } = useTranslation();

  useEffect(() => {
    setFormData({
      name: initialValues.name || "",
      value: initialValues.value || "",
      controllingField: initialValues.controllingField || "",
    });
    setErrors({});
  }, [initialValues]);

  const validateField = useCallback(
    (field: keyof typeof formData, value: string, requiredMessage: string) => {
      if (!value) return requiredMessage;
      if (!/^[a-zA-Z]*$/.test(value)) return t("COMMON.INVALID_TEXT");
      return null;
    },
    [t]
  );

  const handleChange = useCallback(
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({
          ...prev,
          [field]: validateField(
            field,
            value,
            t(`COMMON.${field.toUpperCase()}_REQUIRED`)
          ),
        }));
      },
    [validateField, t]
  );

  const validateForm = useCallback(() => {
    const newErrors = {
      name: validateField(
        "name",
        formData.name,
        t("COMMON.DISTRICT_NAME_REQUIRED")
      ),
      value: validateField("value", formData.value, t("COMMON.CODE_REQUIRED")),
      controllingField: validateField(
        "controllingField",
        formData.controllingField,
        t("COMMON.STATE_NAME_REQUIRED")
      ),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== null);
  }, [formData, validateField, t]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      onSubmit(
        formData.name,
        formData.value,
        formData.controllingField,
        fieldId,
        districtId
      );
      setFormData({
        name: "",
        value: "",
        controllingField: "",
      });
      onClose();
    }
  }, [formData, validateForm, onSubmit, fieldId, districtId, onClose]);

  const isEditing = useMemo(() => !!initialValues.name, [initialValues]);
  const buttonText = useMemo(
    () => (isEditing ? t("COMMON.UPDATE") : t("COMMON.SUBMIT")),
    [isEditing, t]
  );
  const dialogTitle = useMemo(
    () => (isEditing ? t("COMMON.UPDATE_DISTRICT") : t("COMMON.ADD_DISTRICT")),
    [isEditing, t]
  );

  const renderTextField = useCallback(
    (
      label: string,
      value: string,
      error: string | null,
      field: keyof typeof formData
    ) => (
      <TextField
        margin="dense"
        label={label}
        type="text"
        fullWidth
        variant="outlined"
        value={value}
        onChange={handleChange(field)}
        error={!!error}
        helperText={error}
      />
    ),
    [handleChange]
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: "14px" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        {renderTextField(
          t("COMMON.STATE_NAME"),
          formData.controllingField,
          errors.controllingField,
          "controllingField"
        )}
        {renderTextField(
          t("COMMON.DISTRICT_NAME"),
          formData.name,
          errors.name,
          "name"
        )}
        {renderTextField(
          t("COMMON.DISTRICT_CODE"),
          formData.value,
          errors.value,
          "value"
        )}
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
            fontSize: "14px",
            fontWeight: "500",
            width: "auto",
            height: "40px",
          }}
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
