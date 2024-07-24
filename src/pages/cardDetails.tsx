// pages/cardDetails.js
import { useRouter } from "next/router";
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import cardData from "@/pages/data/cardData";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import FilterSearchBar from "@/components/FilterSearchBar";
import CustomStepper from "@/components/Steper";
import { useState } from "react";

const CardDetails = () => {
  const router = useRouter();
  const { cardId } = router.query;
  const [grade, setGrade] = useState("");
  const [medium, setMedium] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const card = cardData.find((card) => card.id === cardId);

  if (!card) {
    return <Typography>Card not found</Typography>;
  }

  const handleBackClick = () => {
    router.back();
  };

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  const handleMediumChange = (event) => {
    setMedium(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleBoardClick = (board) => {
    router.push({
      pathname: "/subjectDetails",
      query: { boardId: board.id, cardId: card.id },
    });
  };

  const handleCopyLink = (board) => {
    // Implement copy link logic here
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
      ></FilterSearchBar>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{card.state}</Typography>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <CustomStepper completedSteps={card.boardsUploaded} />
          <Typography
            sx={{
              fontSize: "14px",
              color: "#7C766F",
            }}
          >
            ({card.boardsUploaded}/{card.totalBoards} Boards fully uploaded)
          </Typography>
        </Box>
      </Box>
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
                  },
                }}
              />
              <Typography sx={{ fontSize: "14px" }}>
                {card.boardsUploaded} / {card.totalBoards} {"subjects uploaded"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={(e) => {
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

export default CardDetails;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
