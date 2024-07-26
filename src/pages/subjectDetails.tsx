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
import cardData from "@/data/cardData";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import FilterSearchBar from "@/components/FilterSearchBar";
import { MouseEvent } from "react";

interface Card {
  id: number;
  state: string;
  boardsUploaded: number;
  totalBoards: number;
  boards: string[];
  subjects: string[];
}

const SubjectDetails = () => {
  const router = useRouter();
  const { boardId, cardId } = router.query;

  const card = cardData.find((card) => card.id === (cardId as string));

  if (!card) {
    return <Typography>Card not found</Typography>;
  }

  const handleBackClick = () => {
    router.back();
  };

  const handleCopyLink = (subject: string) => {
    // Implement copy link logic here
  };

  const handleCardClick = (subject: string) => {
    router.push(`/importCsv?subject=${encodeURIComponent(subject)}`);
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
        card={undefined}
        selectFilter={undefined}
        onBackClick={undefined}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">{card.state}</Typography>

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
          {card.boardsUploaded} / {card.totalBoards} {"boards fully uploaded"}
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
              cursor: "pointer",
              border: "1px solid #0000001A",
              boxShadow: "none",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "#EAF2FF",
              },
              marginTop: "8px",
            }}
            onClick={() => handleCardClick(subject)}
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
                sx={{
                  color: "#06A816",
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                    stroke: "#06A816",
                  },
                }}
              />
              <Typography sx={{ fontSize: "14px" }}>
                {/* {subject.uploaded} / {subject.total} {"topics uploaded"} */}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleCopyLink(subject);
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

export default SubjectDetails;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
