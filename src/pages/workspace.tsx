import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const workspace = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const navigateEditor = () => {
        router.push('/editor')
    }

    return (
      <Box m={2}>
        <Typography variant="h2"> {t("WORKSPACE.EDITOR_WORKSPACE")}</Typography>
        <Button
          variant="outlined"
          sx={{
            marginTop: "8px",
            borderRadius: "8px",
            borderColor: "#E0E0E0",
            backgroundColor: "#F8F8F8",
            color: "#000000",
            textTransform: "none",
            padding: "12px 28px",
            fontSize: "16px",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            "&:hover": {
              backgroundColor: "#E0E0E0",
              borderColor: "#CCCCCC",
            },
          }}
          startIcon={
            <DescriptionOutlinedIcon sx={{ fontSize: 32, color: "#000000" }} />
          } 
          onClick={navigateEditor}
        >
          {t("WORKSPACE.COURSE")}
        </Button>
      </Box>
    );
}

export default workspace


export async function getStaticProps({ locale }: any) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }

  