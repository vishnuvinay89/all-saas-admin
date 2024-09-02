import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import CustomStepper from "@/components/Steper";
import FilterSearchBar from "@/components/FilterSearchBar";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ProtectedRoute from "../../components/ProtectedRoute";
import cardData from "@/data/cardData";
import Loader from "@/components/Loader";
import { getChannelDetails } from "@/services/coursePlanner";

const Foundation = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // State management
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [grade, setGrade] = useState("");
  const [medium, setMedium] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectFilter, setSelectFilter] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        const data = await getChannelDetails();
       console.log(data?.result?.channel?.frameworks);
       localStorage.setItem("channelDetails", JSON.stringify(data?.result?.channel?.frameworks))
      } catch (err) {
        console.log(err);
        
      } finally {
        setLoading(false);
      }
    };

    fetchChannelDetails();
  }, []);


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

  const handleFilter = (value: string) => {
    setSelectFilter(value);
  };

  const handleCopyLink = (state: string) => {
    const link = `${window.location.origin}/course-planner/foundation/${state}`;
    navigator.clipboard.writeText(link).then(
      () => {
        alert("Link copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy link: ", err);
      },
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
          selectFilter={selectFilter}
          onBackClick={undefined}
        />

        {loading ? (
          <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />
        ) : (
          <Box sx={{ pl: '20px' }}>
            {/* <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr",
                gap: isSmallScreen ? "8px" : "16px",
                mb: 2,
              }}
            >
              <Typography>{t("MASTER.STATE")}</Typography>
              <Typography>{t("COURSE_PLANNER.ACTIVITY")}</Typography>
              <Typography>{t("COURSE_PLANNER.COPY_LINK")}</Typography>
            </Box> */}
            <Grid container spacing={2}>
              {!selectedCardId ? (
                cardData?.map((card:any) => (
                  <Grid item xs={12} md={4} key={card.id}> {/* Added item prop and key here */}
                    <Box
                      sx={{
                        cursor: "pointer",
                        border: "1px solid #D0C5B4",
                        padding: '10px',
                        borderRadius: '8px',
                        display:'flex',
                        justifyContent:'space-between',
                        "&:hover": {
                          backgroundColor: "#D0C5B4",
                        },
                      }}
                      onClick={() => handleCardClick(card.id)}
                    >
                      <Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: "18px" }}
                        >
                          <FolderOutlinedIcon />
                          <Typography>{card.state}</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <CustomStepper completedSteps={card.boardsUploaded} />
                          <Typography
                            sx={{
                              fontSize: isSmallScreen ? "12px" : "14px",
                              color: "#7C766F",
                            }}
                          >
                            ({card.boardsUploaded}/{card.totalBoards}{" "}
                            {t("COURSE_PLANNER.BOARDS_FULLY_UPLOADED")})
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    </Box>
                  </Grid>
                ))
              ) : (
                <Typography>{""}</Typography>
              )}
            </Grid>
          </Box>
        )}
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
