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
import { getStateBlockDistrictList } from "@/services/MasterDataService";
import { getUserDetails } from "@/services/UserList";
import { Storage } from "@/utils/app.constant";

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
  // State for form data, initialized with initialValues
  const [formData, setFormData] = useState({
    name: initialValues?.name ?? "",
    value: initialValues?.value ?? "",
    controllingField: initialValues?.controllingField ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [states, setStates] = useState<{ value: string; label: string }[]>([]);
  const [stateCode, setStateCode] = useState<any>([]);
  const [stateValue, setStateValue] = useState<string>("");

  const { t } = useTranslation();

  // Effect to fetch user details when modal opens
  useEffect(() => {
    const fetchUserDetail = async () => {
      let userId: any;
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          userId = localStorage.getItem(Storage.USER_ID);
        }
        const response = await getUserDetails(userId);
        console.log("profile api is triggered", response.userData.customFields);

        const statesField = response.userData.customFields.find(
          (field: { label: string }) => field.label === "STATES"
        );

        console.log("stateField", statesField);

        if (statesField) {
          setStateValue(statesField.value);
          setStateCode(statesField.code);
        }

        console.log("stateValue", stateValue);
        console.log("stateCode", stateCode);
      } catch (error) {
        console.log(error);
      }
    };
    if (open) {
      fetchUserDetail();
    }
  }, [open]);

  useEffect(() => {
    setFormData({
      name: initialValues.name ?? "",
      value: initialValues.value ?? "",
      controllingField: initialValues.controllingField ?? "",
    });
    setErrors({});
  }, [initialValues]);

  const isAlphabetic = (input: string) =>
    input === "" || /^[a-zA-Z\s]+$/.test(input);

  // Handle input change and validation
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (value === "") {
      setErrors((prev) => ({
        ...prev,
        [field]: t(
          field === "name"
            ? "COMMON.DISTRICT_NAME_REQUIRED"
            : field === "controllingField"
              ? "COMMON.STATE_NAME_REQUIRED"
              : "COMMON.CODE_REQUIRED"
        ),
      }));
    } else if (field !== "controllingField" && !isAlphabetic(value)) {
      setErrors((prev: Record<string, string | null>) => {
        const newErrors: Record<string, string | null> = {
          ...prev,
          [field]: field === "controllingField" ? value : null,
        };
        return newErrors;
      });
    }
  };

  // Validate form before submitting
  const validateForm = () => {
    const newErrors = {
      name: !formData.name
        ? t("COMMON.DISTRICT_NAME_REQUIRED")
        : !isAlphabetic(formData.name)
          ? t("COMMON.INVALID_TEXT")
          : null,
      value: !formData.value
        ? t("COMMON.CODE_REQUIRED")
        : !isAlphabetic(formData.value)
          ? t("COMMON.INVALID_TEXT")
          : null,
      controllingField: !formData.controllingField
        ? t("COMMON.STATE_NAME_REQUIRED")
        : null,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== null);
  };

  // Handle form submission
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
    ? t("COMMON.UPDATE_DISTRICT")
    : t("COMMON.ADD_DISTRICT");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: "14px" }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Select
          value={formData.controllingField}
          onChange={(e) => handleChange("controllingField", e.target.value)}
          fullWidth
          displayEmpty
          variant="outlined"
          margin="dense"
          error={!!errors.controllingField}
        >
          <MenuItem value="" disabled>
            {t("COMMON.SELECT_STATE")}
          </MenuItem>
          <MenuItem key={stateCode} value={stateCode}>
            {stateValue}
          </MenuItem>
        </Select>
        {errors.controllingField && (
          <Typography variant="caption" color="error">
            {errors.controllingField}
          </Typography>
        )}
        <TextField
          margin="dense"
          label={t("COMMON.DISTRICT_NAME")}
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
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
          onChange={(e) => handleChange("value", e.target.value.toUpperCase())}
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
