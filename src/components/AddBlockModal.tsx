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
import { getDistrictsForState } from "@/services/MasterDataService";
import { getCohortList } from "@/services/CohortService/cohortService";

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

  const [districtsOptionRead, setDistrictsOptionRead] = useState<any>([]);
  const [districtCodeArr, setDistrictCodeArr] = useState<any>([]);
  const [districtNameArr, setDistrictNameArr] = useState<any>([]);

  const { t } = useTranslation();

  useEffect(() => {
    setFormData({
      name: initialValues.name || "",
      value: initialValues.value || "",
      controllingField: initialValues.controllingField || "",
    });
    setErrors({});
  }, [initialValues]);

  const fetchDistricts = async () => {
    try {
      const data = await getDistrictsForState({
        fieldName: "districts",
      });

      const districts = data?.result?.values || [];
      setDistrictsOptionRead(districts);

      const districtNameArray = districts.map((item: any) => item.label);
      setDistrictNameArr(districtNameArray);

      const districtCodeArray = districts.map((item: any) => item.value);
      setDistrictCodeArr(districtCodeArray);

      // const districtFieldID = data?.result?.fieldId || "";
      // setDistrictFieldId(districtFieldID);

      console.log("districtNameArray", districtNameArray);
    } catch (error) {
      console.error("Error fetching districts", error);
    }
  };

  useEffect(() => {
    if (open) fetchDistricts();
  }, [open, formData.controllingField]);

  const getFilteredCohortData = async () => {
    try {
      const reqParams = {
        limit: 0,
        offset: 0,
        filters: {
          name: "",
          states: "",
          type: "DISTRICT",
        },
        sort: ["name","asc"],
      };

      const response = await getCohortList(reqParams);

      const cohortDetails = response?.results?.cohortDetails || [];

      const filteredDistrictData = cohortDetails
        .map(
          (districtDetail: {
            cohortId: any;
            name: string;
            createdAt: any;
            updatedAt: any;
            createdBy: any;
            updatedBy: any;
          }) => {
            const transformedName = districtDetail.name;

            const matchingDistrict = districtsOptionRead.find(
              (district: { label: string }) =>
                district.label === transformedName
            );
            return {
              label: transformedName,
              value: matchingDistrict ? matchingDistrict.value : null,
              createdAt: districtDetail.createdAt,
              updatedAt: districtDetail.updatedAt,
              createdBy: districtDetail.createdBy,
              updatedBy: districtDetail.updatedBy,
              cohortId: districtDetail?.cohortId,
            };
          }
        )
        .filter((district: { label: any }) =>
          districtNameArr.includes(district.label)
        );

      console.log("filteredDistrictData", filteredDistrictData);

      setDistricts(filteredDistrictData);
    } catch (error) {
      console.error("Error fetching and filtering cohort districts", error);
    }
  };
  useEffect(() => {
    getFilteredCohortData();
  }, []);

  const validateField = (
    field: keyof typeof formData,
    value: string,
    requiredMessage: string
  ) => {
    if (!value) return requiredMessage;
    if (field !== "controllingField" && !/^[a-zA-Z\s]+$/.test(value))
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
      <Divider />
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
          disabled={isEditing}
        >
          <MenuItem value="">{t("COMMON.SELECT_DISTRICT")}</MenuItem>
          {districtsOptionRead.length > 0 ? (
            districtsOptionRead.map((district: any) => (
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
