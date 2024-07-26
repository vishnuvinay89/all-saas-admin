import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Box, Card, Typography, Button } from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import CustomStepper from "@/components/Steper";
import FilterSearchBar from "@/components/FilterSearchBar";
import { useState } from "react";
import { useRouter } from "next/router";

import cardData from "@/pages/data/cardData";

const Foundation = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [grade, setGrade] = useState("");
  const [medium, setMedium] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectFilter, setSelectFilter] = useState("");

  const handleCardClick = (id: any) => {
    router.push(`/stateDetails?cardId=${id}`);
  };

  const handleGradeChange = (event: any) => {
    setGrade(event.target.value);
  };

  const handleMediumChange = (event: any) => {
    setMedium(event.target.value);
  };

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const handleDropdownChange = (event: any) => {
    setSelectedOption(event.target.value);
  };
  const handleFilter = (event: any) => {
    setSelectFilter(event.target.value);
  };

  const handleCopyLink = (state: string) => {
    const link = `${window.location.origin}/course-planner/foundation/${state}`;
    navigator.clipboard.writeText(link).then(
      () => {
        alert("Link copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy link: ", err);
      }
    );
  };
  return (
    <ProtectedRoute>
      <>
        <FilterSearchBar
          grade={grade}
          medium={medium}
          searchQuery={searchQuery}
          handleGradeChange={handleGradeChange}
          handleMediumChange={handleMediumChange}
          handleSearchChange={handleSearchChange}
          selectedOption={selectedOption} 
          handleDropdownChange={(event) => handleFilter(event.target.value)} 
          card={undefined}
          selectFilter={undefined}
          onBackClick={undefined}
        />{" "}
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
            }}
          >
            <Typography>{t("SIDEBAR.STATE")}</Typography>
            <Typography>{t("COURSE_PLANNER.ACTIVITY")}</Typography>
            <Typography>{t("COURSE_PLANNER.COPY_LINK")}</Typography>
          </Box>
          {!selectedCardId ? (
            cardData.map((card) => (
              <Card
                key={card.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 1fr",
                  padding: "14px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedCardId === card.id ? "#e0f7fa" : "white",
                  border: "1px solid #0000001A",
                  boxShadow: "none",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "#EAF2FF",
                  },
                  marginTop: "10px",
                }}
                onClick={() => handleCardClick(card.id)}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "18px" }}
                >
                  <FolderOutlinedIcon />
                  <Typography>{card.state}</Typography>
                </Box>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                  <CustomStepper completedSteps={card.boardsUploaded} />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#7C766F",
                    }}
                  >
                    ({card.boardsUploaded}/{card.totalBoards}{" "}
                    {t("COURSE_PLANNER.BOARDS_FULLY_UPLOADED")})
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr" }}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink(card.state);
                    }}
                    sx={{ minWidth: "auto", padding: 0 }}
                  >
                    <InsertLinkOutlinedIcon />
                  </Button>
                </Box>
              </Card>
            ))
          ) : (
            <Typography>{""}</Typography>
          )}
        </Box>
      </>
    </ProtectedRoute>
  );
};

export default Foundation;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
