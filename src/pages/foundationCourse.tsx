import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ProtectedRoute from "../components/ProtectedRoute";
import HeaderComponent from "@/components/HeaderComponent";
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import CustomStepper from "@/components/Steper";
import { useState } from "react";

const FoundationCourse = () => {
  const { t } = useTranslation();
  const [selectedCardId, setSelectedCardId] = useState(null);

  const userProps = {
    searchPlaceHolder: "search",
    showStateDropdown: false,
    showAddNew: false,
  };

  const handleCopyLink = () => {
    const link = "https://example.com";
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy the link: ", err);
      });
  };

  const handleCardClick = (id: string) => {
    setSelectedCardId(id);
  };  const cardData = [
    { id: "1", state: "Andhra Pradesh", boardsUploaded: 1, totalBoards: 3, details: "Andhra Pradesh is a state in the southeastern coastal region of India." },
    { id: "2", state: "Maharashtra", boardsUploaded: 2, totalBoards: 3, details: "Maharashtra is a state in the western peninsular region of India." },
    { id: "3", state: "Karnataka", boardsUploaded: 3, totalBoards: 3, details: "Karnataka is a state in the southwestern region of India." },
    { id: "4", state: "Tamil Nadu", boardsUploaded: 1, totalBoards: 3, details: "Tamil Nadu is a state in the southern part of India." },
    { id: "5", state: "Kerala", boardsUploaded: 2, totalBoards: 3, details: "Kerala is a state on the southwestern Malabar Coast of India." },
    { id: "6", state: "Telangana", boardsUploaded: 3, totalBoards: 3, details: "Telangana is a state in the south-central region of India." },
    { id: "7", state: "Gujarat", boardsUploaded: 1, totalBoards: 3, details: "Gujarat is a state on the western coast of India." },
    { id: "8", state: "Rajasthan", boardsUploaded: 2, totalBoards: 3, details: "Rajasthan is a state in northern India." },
    { id: "9", state: "Madhya Pradesh", boardsUploaded: 3, totalBoards: 3, details: "Madhya Pradesh is a state in central India." },
    { id: "10", state: "Uttar Pradesh", boardsUploaded: 1, totalBoards: 3, details: "Uttar Pradesh is a state in northern India." },
  ];

  const selectedCard = cardData.find((card) => card.id === selectedCardId);

  return (
    <ProtectedRoute>
      <>
        <HeaderComponent {...userProps}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
              gap: "16px",
              mb: 2,
            }}
          >
            <Typography>State</Typography>
            <Typography>Activity</Typography>
            <Typography>Copy Link</Typography>
          </Box>
          {selectedCardId ? (
            <Card
              sx={{
                mt: "16px",
                p: "16px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FolderOutlinedIcon />
                <Typography variant="h6">{selectedCard.state}</Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <CircularProgress completedSteps={selectedCard.boardsUploaded} />
                <Typography sx={{ fontSize: "14px", mt: "8px" }}>
                  ({selectedCard.boardsUploaded}/{selectedCard.totalBoards} Boards fully uploaded)
                </Typography>
              </Box>
              <Button onClick={() => setSelectedCardId(null)} sx={{ mt: "16px" }}>
                Back to list
              </Button>
            </Card>
          ) : (
            cardData.map((card) => (
              <Card
                key={card.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 1fr",
                  alignItems: "center",
                  padding: "16px",
                  marginTop: "16px",
                  gap: "16px",
                  cursor: "pointer",
                  backgroundColor: selectedCardId === card.id ? "#e0f7fa" : "white",
                }}
                onClick={() => handleCardClick(card.id)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FolderOutlinedIcon />
                  <Typography>{card.state}</Typography>
                </Box>
                <Box>
                  <CustomStepper completedSteps={card.boardsUploaded} />
                  <Typography sx={{ fontSize: "14px", mt: "8px" }}>
                    ({card.boardsUploaded}/{card.totalBoards} Boards fully uploaded)
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleCopyLink();
                    }}
                    sx={{ minWidth: "auto", padding: 0 }}
                  >
                    <InsertLinkOutlinedIcon />
                  </Button>
                </Box>
              </Card>
            ))
          )}
        </HeaderComponent>
      </>
    </ProtectedRoute>
  );
};

export default FoundationCourse;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
