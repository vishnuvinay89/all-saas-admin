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
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useTranslation } from "next-i18next";
import { getDistrictsForState } from "@/services/MasterDataService";

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

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [districts, setDistricts] = useState<
    { value: string; label: string }[]
  >([]);
  const { t } = useTranslation();

  useEffect(() => {
    setFormData({
      name: initialValues.name || "",
      value: initialValues.value || "",
      controllingField: initialValues.controllingField || "",
    });
    setErrors({});
  }, [initialValues]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await getDistrictsForState({
          limit: 10,
          offset: 0,
          controllingfieldfk: undefined,
          fieldName: "districts",
        });
        if (response.result.values) {
          setDistricts(response.result.values);
        } else {
          console.error("Unexpected response format:", response);
          setDistricts([]);
        }
      } catch (error: any) {
        console.error("Error fetching districts:", error.message);
        setDistricts([]);
      }
    };

    if (open) fetchDistricts();
  }, [open, formData.controllingField]);

  const validateField = (
    field: keyof typeof formData,
    value: string,
    requiredMessage: string
  ) => {
    if (!value) return requiredMessage;
    if (field !== "controllingField" && !/^[a-zA-Z\s]+$/.test(value))
      return t("COMMON.INVALID_TEXT");
    return null;
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      const value = typeof e.target.value === "string" ? e.target.value : "";
      setFormData((prev) => ({ ...prev, [field]: value }));

      let errorMessage: string | null = null;

      if (field === "name") {
        errorMessage = validateField(
          field,
          value,
          t("COMMON.BLOCK_NAME_REQUIRED")
        );
      } else if (field === "value") {
        errorMessage = validateField(
          field,
          value,
          t("COMMON.BLOCK_CODE_REQUIRED")
        );
      } else if (field === "controllingField") {
        errorMessage = validateField(
          field,
          value,
          t("COMMON.DISTRICT_NAME_REQUIRED")
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
        t("COMMON.BLOCK_NAME_REQUIRED")
      ),
      value: validateField(
        "value",
        formData.value,
        t("COMMON.BLOCK_CODE_REQUIRED")
      ),
      controllingField: validateField(
        "controllingField",
        formData.controllingField,
        t("COMMON.DISTRICT_NAME_REQUIRED")
      ),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== null);
  };

  const handleSubmit = () => {
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
  };

  const isEditing = !!initialValues.name;
  const buttonText = isEditing ? t("COMMON.UPDATE") : t("COMMON.SUBMIT");
  const dialogTitle = isEditing
    ? t("COMMON.UPDATE_BLOCK")
    : t("COMMON.ADD_BLOCK");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: "14px" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Select
          value={formData.controllingField}
          onChange={(e) =>
            handleChange("controllingField")(
              e as React.ChangeEvent<HTMLInputElement>
            )
          }
          fullWidth
          displayEmpty
          variant="outlined"
          margin="dense"
          error={!!errors.controllingField}
        >
          <MenuItem value="">{t("COMMON.SELECT_DISTRICT")}</MenuItem>
          {districts.length > 0 ? (
            districts.map((district) => (
              <MenuItem key={district.value} value={district.value}>
                {district.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>{t("COMMON.NO_DISTRICTS")}</MenuItem>
          )}
        </Select>
        {errors.controllingField && (
          <Typography variant="caption" color="error">
            {errors.controllingField}
          </Typography>
        )}
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
          variant="outlined"
          sx={{ fontSize: "14px" }}
          color="primary"
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
