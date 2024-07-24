import {
  Box,
  Button,
  Divider,
  FormControl,
  Modal,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { showToastMessage } from "./Toastify";
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
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const reasons = [
    { value: "Incorrect Data Entry", label: t("COMMON.INCORRECT_DATA_ENTRY") },
    { value: "Duplicated User", label: t("COMMON.DUPLICATED_USER") },
  ];

  const handleRadioChange = (value: string) => {
    console.log(value);
    setSelectedValue(value);
    setConfirmButtonDisable(false);
  };

  const handleOtherReasonChange = (event: any) => {
    setOtherReason(event.target.value);
  };

  return (
    <>
      <CustomModal
        open={open}
        handleClose={onClose}
        title={t("COMMON.DELETE_USER")}
        subtitle={t("COMMON.REASON_FOR_DELETION")}
        primaryBtnText={t("COMMON.DELETE_USER_WITH_REASON")}
        // secondaryBtnText="Cancel"
        primaryBtnClick={handleDeleteAction}
        primaryBtnDisabled={confirmButtonDisable}
        // secondaryBtnClick={handleSecondaryClick}
      >
        <>
          <Box padding={"0 1rem"}>
            {reasons.map((option) => (
              <>
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
              </>
            ))}
          </Box>
        </>
      </CustomModal>
    </>
  );
};

export default DeleteUserModal;
