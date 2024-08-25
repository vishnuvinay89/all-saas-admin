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
import { Checkbox, FormControlLabel } from '@mui/material';


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
  centers:any;
  userId?:string;
  userType?:string;
  userName?:string

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
  userName
}) => {
  console.log(userName)
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const reasons = [
    { value: "Incorrect Data Entry", label: t("COMMON.INCORRECT_DATA_ENTRY") },
    { value: "Duplicated User", label: t("COMMON.DUPLICATED_USER") },
  ];
  const [checkedCohortDeletion, setCheckedCohortDeletion] = useState(centers!=="-"? true: false);

  const handleRadioChange = (value: string) => {
    console.log(value);
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
    if(centers!=="")
    { setCheckedCohortDeletion(true);}
    else
    {
      setCheckedCohortDeletion(false);
    }
    onClose();
  };
  const wrappedHandleDeleteAction = async () => {
   // setCheckedCohortDeletion(false);
    await handleDeleteAction(); 
    handleClose(); 
  };
  return (
    <>
      <CustomModal
        open={open}
        handleClose={handleClose}
        title={t("COMMON.DELETE_USER")}
       // subtitle={t("COMMON.REASON_FOR_DELETION")}
        primaryBtnText={t("COMMON.DELETE_USER_WITH_REASON")}
        // secondaryBtnText="Cancel"
        primaryBtnClick={wrappedHandleDeleteAction}
        primaryBtnDisabled={ confirmButtonDisable}
        // secondaryBtnClick={handleSecondaryClick}
      >
        <>
       { centers!=="-" && (<Box 
  sx={{ 
    border: '1px solid #ccc', 
    borderRadius: '8px', 
    padding: '16px',
    width: 'fit-content',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  }}
>
  <Typography variant="body1" sx={{ marginBottom: '12px', fontWeight: 'bold', color: '#333' }}>
  {t("COMMON.USER_COHORTS", {name: userName})} 
  </Typography>
  
  <Box 
    sx={{ 
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '8px',
      marginBottom: '16px',
      backgroundColor: '#fff',
      maxHeight: '200px',
      overflowY: 'auto',
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
    label=  {t("COMMON.DELETE_COHORT_WARNING")} 
    sx={{ marginTop: '12px', color: '#555' }}
  />
</Box>)
}

        {checkedCohortDeletion && ( <Box padding={"0 1rem"}>
          <Typography id="modal-subtitle" variant="h2"  marginTop= "10px">
         { t("COMMON.REASON_FOR_DELETION")}              </Typography>
          
            {reasons?.map((option) => (
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
        )
}
        </>
      </CustomModal>
    </>
  );
};

export default DeleteUserModal;
