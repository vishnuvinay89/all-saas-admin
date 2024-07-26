import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import cardData from "@/data/cardData";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import FilterSearchBar from "@/components/FilterSearchBar";
import CustomStepper from "@/components/Steper";
import { useTranslation } from "next-i18next";
import Loader from "@/components/Loader";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const StateDetails = () => {
  const router = useRouter();
  const { cardId } = router.query;
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // State management
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState("");
  const [medium, setMedium] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate data fetching
      setTimeout(() => {
        const foundCard = cardData.find((c) => c.id === cardId);
        setCard(foundCard);
        setLoading(false);
      }, 2000);
    };

    fetchData();
  }, [cardId]);

  const handleBackClick = () => {
    router.back();
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

  const handleBoardClick = (board: string) => {
    router.push({
      pathname: "/subjectDetails",
      query: { boardId: board, cardId: card.id },
    });
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

  if (loading) {
    return <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />;
  }

  if (!card) {
    return <Typography>{t("COURSE_PLANNER.DATA_NOT_FOUND")}</Typography>;
  }

  return (
    <Box>
      <FilterSearchBar
        grade={grade}
        medium={medium}
        searchQuery={searchQuery}
        handleGradeChange={handleGradeChange}
        handleMediumChange={handleMediumChange}
        handleSearchChange={handleSearchChange}
        selectedOption={selectedOption}
        handleDropdownChange={handleDropdownChange}
        card={undefined}
        selectFilter={""}
        onBackClick={() => {}}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{card.state}</Typography>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <CustomStepper completedSteps={card.boardsUploaded} />
          <Typography
            sx={{
              fontSize: isSmallScreen ? "12px" : "14px",
              color: "#7C766F",
            }}
          >
            ({card.boardsUploaded}/{card.totalBoards}
            {t("COURSE_PLANNER.BOARDS_FULLY_UPLOADED")})
          </Typography>
        </Box>
      </Box>
      <Box sx={{ marginTop: "16px" }}>
        {card.boards.map(
          (
            board:
              | string
              | number
              | bigint
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | Promise<React.AwaitedReactNode>
              | null
              | undefined,
            index: React.Key | null | undefined
          ) => (
            <Card
              key={index}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr",
                alignItems: "center",
                cursor: "pointer",
                border: "1px solid #0000001A",
                boxShadow: "none",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "#EAF2FF",
                },
                marginTop: "8px",
                padding: "16px",
              }}
              onClick={() => {
                if (typeof board === "string") {
                  handleBoardClick(board);
                }
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FolderOutlinedIcon />
                <Typography variant="h6" sx={{ fontSize: "16px" }}>
                  {board}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <Box sx={{ width: "40px", height: "40px" }}>
                  <CircularProgressbar
                    value={(card.boardsUploaded / card.totalBoards) * 100}
                    strokeWidth={10}
                    styles={buildStyles({
                      pathColor: "#06A816",
                      trailColor: "#E6E6E6",
                      strokeLinecap: "round",
                    })}
                  />
                </Box>
                <Typography sx={{ fontSize: "14px" }}>
                  {card.boardsUploaded} / {card.totalBoards}{" "}
                  {t("COURSE_PLANNER.SUBJECTS_UPLOADED")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleCopyLink(board as string);
                  }}
                  sx={{ minWidth: "auto", padding: 0 }}
                >
                  <InsertLinkOutlinedIcon />
                </Button>
              </Box>
            </Card>
          )
        )}
      </Box>
    </Box>
  );
};

export default StateDetails;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
