import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { showToastMessage } from './Toastify';
import { sendCredentialService } from '@/services/NotificationService';
import { FormContextType } from "@/utils/app.constant";

interface SendCredentialModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
 // isLearnerAdded?: boolean;
  userType?:string;
  handleBackAction: () => void;


}
const SendCredentialModal: React.FC<SendCredentialModalProps> = ({
  open,
  onClose,
  email,
 // isLearnerAdded,
  userType,
  handleBackAction
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '65%',
    boxShadow: 24,
    bgcolor: '#fff',
    borderRadius: '16px',
    '@media (min-width: 600px)': {
      width: '450px',
    },
  };
  // const handleAction = async () => {
  //   onClose();
  // };

  const handleBackActionForLearner = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style }}>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          sx={{ padding: '18px 16px' }}
        >
          <Box marginBottom={'0px'}>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.warning['A200'],
                fontSize: '14px',
              }}
              component="h2"
            >
              {t('COMMON.NEW', { role: userType })}
            </Typography>
          </Box>
          <CloseIcon
            sx={{
              cursor: 'pointer',
              color: theme.palette.warning['A200'],
            }}
            onClick={onClose}
          />
        </Box>
        <Divider />
        {/* {isButtonAbsent ? ( */}
        <Box
          sx={{
            padding: '18px 16px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.warning['400'],
                fontSize: '14px',
              }}
              component="h2"
            >
              {userType===FormContextType.STUDENT
                ? t('COMMON.CREDENTIALS_EMAILED_OF_LEARNER')
                : userType===FormContextType.TEAM_LEADER?t('COMMON.CREDENTIALS_EMAILED_OF_TEAM_LEADER', {email}): t('COMMON.CREDENTIALS_EMAILED_OF_FACILITATOR', {email})}
            </Typography>
          </Box>
          
        </Box>

        <>
          <Box mt={1.5}>
            <Divider />
          </Box>
          <Box p={'18px'} display={'flex'} gap={'1rem'}>
            {/* <Button
              className="w-100"
              sx={{ boxShadow: 'none' }}
              variant="outlined"
              onClick={() => handleBackAction()}
            >
              {t('COMMON.BACK')}
            </Button> */}
           

           {
  userType === FormContextType.STUDENT ? (
    <Button
      className="w-100"
      sx={{ boxShadow: 'none' }}
      variant="contained"
      onClick={handleBackActionForLearner}
    >
      {t('COMMON.OKAY')}
    </Button>
  ) : (
    <>
      <Button
        className="w-100"
        sx={{ boxShadow: 'none' }}
        variant="outlined"
       onClick={ handleBackAction}
      >
        {t('COMMON.BACK')}
      </Button>
      <Button
            variant="contained"
            type="submit"
            form="dynamic-form" // Add this line
            sx={{
              fontSize: "14px",
              fontWeight: "500",
              width: "auto",
              height: "40px",
              marginLeft: "10px",
            }}

            color="primary"
           // disabled={!submitButtonEnable}
            // onClick={() => { 
            //   if(userType!==FormContextType.STUDENT)
            //          setOpenModal(true)
            //   setSubmittedButtonStatus(true);
            //   console.log("Submit button was clicked");
            // }}
          >
        {t('COMMON.SEND_CREDENTIALS')}
          </Button>
      {/* <Button
        className="w-100"
        form="dynamic-form"
        sx={{ boxShadow: 'none' }}
        variant="contained"
      >
        {t('COMMON.SEND_CREDENTIALS')}
      </Button> */}
    </>
  )
}

          </Box>
        </>
      </Box>
    </Modal>
  );
};

export default SendCredentialModal;
