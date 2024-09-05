import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import CustomModal from "./CustomModal";

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  otherReason: string;
  setOtherReason: (value: string) => void;
  handleDeleteAction: any;
  confirmButtonDisable: boolean;
  setConfirmButtonDisable: any;
  centers: any;
  userId?: string;
  userType?: string;
  userName?: string;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  open,
  onClose,
  selectedValue,
  setSelectedValue,
  otherReason,
  setOtherReason,
  handleDeleteAction,
  confirmButtonDisable = true,
  setConfirmButtonDisable,
  centers,
  userId,
  userName,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const reasons = [
    { value: t("CENTERS.LONG_ABSENTEE"), label: t("CENTERS.LONG_ABSENTEE") },
    { value: t("CENTERS.TAKEN_TC"), label: t("CENTERS.TAKEN_TC") },
    {
      value: t("CENTERS.ALLOCATION_CHANGE"),
      label: t("CENTERS.ALLOCATION_CHANGE"),
    },
    {
      value: t("CENTERS.INCORRECT_ENTRY"),
      label: t("CENTERS.INCORRECT_ENTRY"),
    },
    {
      value: t("CENTERS.DUPLICATION_ENTRY"),
      label: t("CENTERS.DUPLICATION_ENTRY"),
    },
  ];
  const [checkedCohortDeletion, setCheckedCohortDeletion] = useState<boolean>(
    centers === "-" ? true : false
  );

  useEffect(() => {
    if (centers === "-") {
      setCheckedCohortDeletion(true);
    } else {
      setCheckedCohortDeletion(false);
    }
  }, [centers]);

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    setConfirmButtonDisable(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedCohortDeletion(event.target.checked);
  };

  const handleOtherReasonChange = (event: any) => {
    setOtherReason(event.target.value);
  };

  const handleClose = () => {
    if (centers === "-") {
      setCheckedCohortDeletion(true);
    } else {
      setCheckedCohortDeletion(false);
    }
    onClose();
  };

  const wrappedHandleDeleteAction = async () => {
    await handleDeleteAction();
    handleClose();
  };

  return (
    <CustomModal
      open={open}
      handleClose={handleClose}
      title={t("COMMON.REMOVE_USER_FROM_CLASS")}
      primaryBtnText={t("COMMON.DELETE_USER_WITH_REASON")}
      primaryBtnClick={wrappedHandleDeleteAction}
      primaryBtnDisabled={confirmButtonDisable}
    >
      {centers !== "-" && (
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            width: "fit-content",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="body1"
            sx={{ marginBottom: "12px", fontWeight: "bold", color: "#333" }}
          >
            {t("COMMON.USER_CLASSES", { name: userName })}
          </Typography>

          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "8px",
              marginBottom: "16px",
              backgroundColor: "#fff",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {centers}
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={checkedCohortDeletion}
                onChange={handleChange}
                color="primary"
              />
            }
            label={t("COMMON.DELETE_CLASS_WARNING")}
            sx={{ marginTop: "12px", color: "#555" }}
          />
        </Box>
      )}
      {checkedCohortDeletion && (
        <Box padding={"0 1rem"}>
          <Typography id="modal-subtitle" variant="h2" marginTop="10px">
            {t("COMMON.REASON")}
          </Typography>

          {reasons?.map((option) => (
            <React.Fragment key={option.value}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography
                  variant="h2"
                  sx={{
                    color: theme.palette.warning["A200"],
                    fontSize: "14px",
                  }}
                  component="h2"
                >
                  {option.label}
                </Typography>

                <Radio
                  sx={{ pb: "20px" }}
                  onChange={() => handleRadioChange(option.value)}
                  value={option.value}
                  checked={selectedValue === option.value}
                />
              </Box>
              <Divider />
            </React.Fragment>
          ))}
        </Box>
      )}
    </CustomModal>
  );
};

export default DeleteUserModal;
