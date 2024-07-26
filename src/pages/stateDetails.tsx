import { useRouter } from "next/router";
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import cardData from "@/pages/data/cardData";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import FilterSearchBar from "@/components/FilterSearchBar";
import CustomStepper from "@/components/Steper";
import { useState, ChangeEvent, MouseEvent } from "react";
import { useTranslation } from "react-i18next";

interface Card {
  id: string;
  state: string;
  boardsUploaded: number;
  totalBoards: number;
  boards: string[];
}

const StateDetails = () => {
  const router = useRouter();
  const { cardId } = router.query;
  const { t } = useTranslation();
  const [grade, setGrade] = useState<string>("");
  const [medium, setMedium] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");

  const card = cardData.find((card) => card.id === (cardId as string));

  if (!card) {
    return <Typography>{t("COURSE_PLANNER.DATA_NOT_FOUND")}</Typography>;
  }

  const handleBackClick = () => {
    router.back();
  };

  const handleGradeChange = (event: SelectChangeEvent<string>) => {
    setGrade(event.target.value);
  };

  const handleMediumChange = (event: SelectChangeEvent<string>) => {
    setMedium(event.target.value);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDropdownChange = (event: SelectChangeEvent<string>) => {
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
      ></FilterSearchBar>
      <Box sx={{ marginTop: "16px" }}>
        {card.boards.map((board, index) => (
          <Card
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
              padding: "14px",
              cursor: "pointer",
              border: "1px solid #0000001A",
              boxShadow: "none",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "#EAF2FF",
              },
              marginTop: "8px",
            }}
            onClick={() => handleBoardClick(board)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FolderOutlinedIcon />
              <Typography variant="h6">{board}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <CircularProgress
                variant="determinate"
                value={(card.boardsUploaded / card.totalBoards) * 100}
                sx={{
                  color: "#06A816",
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                    stroke: "#06A816",
                  },
                }}
              />
              <Typography sx={{ fontSize: "14px" }}>
                {card.boardsUploaded} / {card.totalBoards}{" "}
                {t("COURSE_PLANNER.SUBJECTS_UPLOADED")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleCopyLink(board);
                }}
                sx={{ minWidth: "auto", padding: 0 }}
              >
                <InsertLinkOutlinedIcon />
              </Button>
            </Box>
          </Card>
        ))}
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
