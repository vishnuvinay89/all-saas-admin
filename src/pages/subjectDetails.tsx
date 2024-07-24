// pages/subjectDetails.js
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

const SubjectDetails = () => {
  const router = useRouter();
  const { boardId, cardId } = router.query;

  const card = cardData.find((card) => card.id === cardId);
  console.log(card);

  if (!card) {
    return <Typography>Board not found</Typography>;
  }

  const handleBackClick = () => {
    router.back();
  };

  const handleCopyLink = (subject) => {
    // Implement copy link logic here
  };

  return (
    <Box>
      <FilterSearchBar
        grade=""
        medium=""
        searchQuery=""
        handleGradeChange={() => {}}
        handleMediumChange={() => {}}
        handleSearchChange={() => {}}
        selectedOption=""
        handleDropdownChange={() => {}}
      ></FilterSearchBar>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{card.boards}</Typography>

        <CircularProgress
          variant="determinate"
          value={(card.boardsUploaded / card.totalBoards) * 100}
          sx={{
            color: "#06A816",
            "&.MuiCircularProgress-root": {
              color: "#06A816",
            },
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
        <Typography sx={{ fontSize: "14px" }}>
          {card.boardsUploaded} / {card.totalBoards} {"subjects uploaded"}
        </Typography>
      </Box>
      <Box sx={{ marginTop: "16px" }}>
        {card.subjects.map((subject, index) => (
          <Card
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
              padding: "14px",
              border: "1px solid #0000001A",
              boxShadow: "none",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "#EAF2FF",
              },
              marginTop: "8px",
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
              <Typography variant="h6">{subject}</Typography>
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
                // value={(board.uploaded / board.total) * 100}
                sx={{
                  color: "#06A816",
                  "& .MuiCircularProgress-root": {
                    color: "#CDC5BD",
                  },
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                    stroke: "#06A816",
                  },
                }}
              />
              <Typography sx={{ fontSize: "14px" }}>
                {/* {board.uploaded} / {board.total} {"subjects uploaded"} */}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() => handleCopyLink(subject)}
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

export default SubjectDetails;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
