import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import { Search, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import CustomStepper from "./Steper";

const FilterSearchBar = ({
  grade,
  medium,
  searchQuery,
  handleGradeChange,
  handleMediumChange,
  handleSearchChange,
  selectedOption,
  handleDropdownChange,
  card,
  selectFilter,
  onBackClick,
  showGradeMedium = true,
  showFoundaitonCourse = true,
}) => {
  return (
    <>
      {showFoundaitonCourse && (
        <Box>
          <Typography variant="h1">Foundation Course</Typography>
        </Box>
      )}
      {showGradeMedium && (
        <Box sx={{ p: 1, display: "flex", mb: 2, gap: 2 }}>
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: "120px" }}
          >
            <InputLabel id="grade-label">Grade</InputLabel>
            <Select
              labelId="grade-label"
              value={grade}
              onChange={handleGradeChange}
              label="Grade"
            >
              <MenuItem value="grade1">Grade 1</MenuItem>
              <MenuItem value="grade2">Grade 2</MenuItem>
              <MenuItem value="grade3">Grade 3</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: "120px" }}
          >
            <InputLabel id="medium-label">Medium</InputLabel>
            <Select
              labelId="medium-label"
              value={medium}
              onChange={handleMediumChange}
              label="Medium"
            >
              <MenuItem value="english">English</MenuItem>
              <MenuItem value="hindi">Hindi</MenuItem>
              <MenuItem value="marathi">Marathi</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {card && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
          <IconButton onClick={onBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2">{card.state}</Typography>
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
      )}

      <Box
        sx={{
          display: "flex",
          gap: "8px",
          width: "100%",
          mb: 3,
        }}
      >
        <TextField
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search"
          variant="outlined"
          size="small"
          sx={{
            flexGrow: 1,
            width: "80%",
            height: "48px",
            borderRadius: "28px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "28px",
              height: "100%",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControl
          variant="outlined"
          size="small"
          sx={{ minWidth: "120px", padding: "3px" }}
        >
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={selectFilter}
            onChange={handleDropdownChange}
            label="Filter"
          >
            <MenuItem value="Option 1">Option 1</MenuItem>
            <MenuItem value="Option 2">Option 2</MenuItem>
            <MenuItem value="Option 3">Option 3</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default FilterSearchBar;
