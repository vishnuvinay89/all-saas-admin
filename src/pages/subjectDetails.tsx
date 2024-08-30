import React, { useState, useEffect, MouseEvent } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Card as MuiCard,
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
import Loader from "@/components/Loader";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { getFrameworkDetails } from "@/services/coursePlanner";

// Define Card interface
interface Card {
  id: number;
  state: string;
  boardsUploaded: number;
  totalBoards: number;
  boards: string[];
  subjects: string[];
}

interface FoundCard {
  id: string;
  state: string;
  boardsUploaded: number;
  totalBoards: number;
  details: string;
  boards: string[];
  subjects: string[];
}

const SubjectDetails = () => {
  const router = useRouter();
  const { boardId, cardId } = router.query;

  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<Card | null>(null);
  const [subject, setSubject] = useState<any>();
  const [medium, setMedium] = useState<any>([]);
  const [grade, setGrade] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const foundCard = cardData.find((card) => card.id === cardId) as
          | FoundCard
          | undefined;

        if (foundCard) {
          setCard({
            ...foundCard,
            id: Number(foundCard.id),
          } as Card);
        } else {
          setCard(null);
        }
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, [cardId]);


  useEffect(() => {
    const fetchFrameworkDetails = async () => {
      if (typeof boardId === 'string') {
        try {
          const data = await getFrameworkDetails(boardId);
          console.log(data?.result?.framework);
          setSubject(data?.result?.framework?.categories[0]);
          setMedium(data?.result?.framework?.categories[1]);
          setGrade(data?.result?.framework?.categories[2]);
        } catch (err) {
          console.error('Failed to fetch framework details');
        } finally {
          setLoading(false);
        }
      } else {
        console.error('Invalid boardId');
        setLoading(false);
      }
    };
  
    fetchFrameworkDetails();
  }, [boardId]);
  

  if (loading) {
    return <Loader showBackdrop={true} loadingText="Loading..." />;
  }

  if (!card) {
    return <Typography>Card not found</Typography>;
  }

  const handleBackClick = () => {
    router.back();
  };

  const handleCopyLink = (subject: string) => {};

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
          {card.boardsUploaded} / {card.totalBoards} {"boards fully uploaded"}
        </Typography>
      </Box>
      <Box sx={{ marginTop: "16px" }}>
      {subject?.terms?.map((subj:any, index:any) => (
     <MuiCard
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
      onClick={() => handleCardClick(subj)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <FolderOutlinedIcon />
        <Typography variant="h6">{subj?.name}</Typography> {/* Use subj.name */}
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
          {/* {subj.uploaded} / {subj.total} {"topics uploaded"} */}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            handleCopyLink(subj);
          }}
          sx={{ minWidth: "auto", padding: 0 }}
        >
          <InsertLinkOutlinedIcon />
        </Button>
      </Box>
    </MuiCard>
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
