import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface AddStateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, value: string, fieldId: string) => void;
  fieldId: string;
}

const AddStateModal: React.FC<AddStateModalProps> = ({
  open,
  onClose,
  onSubmit,
  fieldId,
}) => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (name && value) {
      onSubmit(name, value, fieldId);
      setName("");
      setValue("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("COMMON.ADD_STATE")}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("COMMON.CANCEL")}
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {t("COMMON.SUBMIT")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStateModal;
