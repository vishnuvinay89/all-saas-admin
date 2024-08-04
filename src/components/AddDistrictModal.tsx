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

export const AddDistrictModal: React.FC<AddDistrictBlockModalProps> = ({
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

  const [nameError, setNameError] = useState<string | null>(null);
  const [valueError, setValueError] = useState<string | null>(null);
  const [controllingFieldError, setControllingFieldError] = useState<
    string | null
  >(null);

  const { t } = useTranslation();

  useEffect(() => {
    setFormData({
      name: initialValues.name || "",
      value: initialValues.value || "",
      controllingField: initialValues.controllingField || "",
    });
    setNameError(null);
    setValueError(null);
    setControllingFieldError(null);
  }, [initialValues]);

  const isAlphabetic = (input: string) =>
    input === "" || /^[a-zA-Z]+$/.test(input);

  const handleSubmit = () => {
    const { name, value, controllingField } = formData;
    let hasError = false;

    if (!controllingField) {
      setControllingFieldError(t("COMMON.STATE_NAME_REQUIRED"));
      hasError = true;
    } else if (!isAlphabetic(controllingField)) {
      setControllingFieldError(t("COMMON.INVALID_TEXT"));
      hasError = true;
    } else {
      setControllingFieldError(null);
    }

    if (!name) {
      setNameError(t("COMMON.DISTRICT_NAME_REQUIRED"));
      hasError = true;
    } else if (!isAlphabetic(name)) {
      setNameError(t("COMMON.INVALID_TEXT"));
      hasError = true;
    } else {
      setNameError(null);
    }

    if (!value) {
      setValueError(t("COMMON.CODE_REQUIRED"));
      hasError = true;
    } else if (!isAlphabetic(value)) {
      setValueError(t("COMMON.INVALID_TEXT"));
      hasError = true;
    } else {
      setValueError(null);
    }

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

  const handleControllingFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputControllingField = e.target.value;
    if (isAlphabetic(inputControllingField)) {
      setFormData((prev) => ({
        ...prev,
        controllingField: inputControllingField,
      }));
      setControllingFieldError(null);
    } else {
      setControllingFieldError(t("COMMON.INVALID_TEXT"));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = e.target.value;
    if (isAlphabetic(inputName)) {
      setFormData((prev) => ({ ...prev, name: inputName }));
      setNameError(null);
    } else {
      setNameError(t("COMMON.INVALID_TEXT"));
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toUpperCase();
    if (isAlphabetic(inputValue)) {
      setFormData((prev) => ({ ...prev, value: inputValue }));
      setValueError(null);
    } else {
      setValueError(t("COMMON.INVALID_TEXT"));
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
          onChange={handleControllingFieldChange}
          error={!!controllingFieldError}
          helperText={controllingFieldError}
        />
        <TextField
          margin="dense"
          label={t("COMMON.DISTRICT_NAME")}
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleNameChange}
          error={!!nameError}
          helperText={nameError}
        />
        <TextField
          margin="dense"
          label={t("COMMON.DISTRICT_CODE")}
          type="text"
          fullWidth
          variant="outlined"
          value={formData.value}
          onChange={handleValueChange}
          error={!!valueError}
          helperText={valueError}
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
