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

interface AddStateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    value: string,
    fieldId: string,
    stateId?: string
  ) => void;
  fieldId: string;
  initialValues?: {
    name?: string;
    value?: string;
  };
  stateId?: string;
}

export const AddStateModal: React.FC<AddStateModalProps> = ({
  open,
  onClose,
  onSubmit,
  fieldId,
  initialValues = {},
  stateId,
}) => {
  const [name, setName] = useState(initialValues.name || "");
  const [value, setValue] = useState(initialValues.value || "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [valueError, setValueError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setName(initialValues.name || "");
    setValue(initialValues.value || "");
    setNameError(null);
    setValueError(null);
  }, [initialValues]);

  const isAlphabetic = (input: string) =>
    input === "" || /^[a-zA-Z]+$/.test(input);

  const handleSubmit = () => {
    let hasError = false;

    if (!name) {
      setNameError(t("COMMON.STATE_NAME_REQUIRED"));
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
      onSubmit(name, value, fieldId, stateId);
      setName("");
      setValue("");
      onClose();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = e.target.value;
    if (isAlphabetic(inputName)) {
      setName(inputName);
      setNameError(null);
    } else {
      setNameError(t("COMMON.INVALID_TEXT"));
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toUpperCase();
    if (isAlphabetic(inputValue)) {
      setValue(inputValue);
      setValueError(null);
    } else {
      setValueError(t("COMMON.INVALID_TEXT"));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: "14px" }}>
        {stateId ? t("COMMON.UPDATE_STATE") : t("COMMON.ADD_STATE")}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t("COMMON.STATE_NAME")}
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={handleNameChange}
          error={!!nameError}
          helperText={nameError}
        />
        <TextField
          margin="dense"
          label={t("COMMON.ADD_STATE_CODE")}
          type="text"
          fullWidth
          variant="outlined"
          value={value}
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
          sx={{
            width: "auto",
            height: "40px",
            fontSize: "14px",
            fontWeight: "500",
          }}
          variant="contained"
          color="primary"
        >
          {stateId ? t("COMMON.UPDATE") : t("COMMON.SUBMIT")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
