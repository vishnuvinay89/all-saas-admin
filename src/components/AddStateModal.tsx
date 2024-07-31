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

const AddStateModal: React.FC<AddStateModalProps> = ({
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
    // Update form fields if initialValues change
    setName(initialValues.name || "");
    setValue(initialValues.value || "");
    setNameError(null);
    setValueError(null);
  }, [initialValues]);

  const handleSubmit = () => {
    let hasError = false;

    if (!name) {
      setNameError(t("COMMON.NAME_REQUIRED"));
      hasError = true;
    } else {
      setNameError(null);
    }

    if (!value) {
      setValueError(t("COMMON.CODE_REQUIRED"));
      hasError = true;
    } else {
      setValueError(null);
    }

    if (!hasError) {
      onSubmit(name, value, fieldId, stateId);
      setName("");
      setValue("");
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upperCaseValue = e.target.value.toUpperCase();
    setValue(upperCaseValue);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("COMMON.ADD_STATE")}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t("COMMON.NAME")}
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <Button onClick={onClose} color="primary" sx={{ bgcolor: "#E5E5E5" }}>
          {t("COMMON.CANCEL")}
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          sx={{ bgcolor: "#E5E5E5" }}
        >
          {t("COMMON.SUBMIT")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStateModal;
