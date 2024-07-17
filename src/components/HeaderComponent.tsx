import * as React from "react";
import { useState } from "react";
import { MenuItem, Typography, Box, FormControl, useMediaQuery, Grid, Button } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "@/components/layouts/header/SearchBar";
import { useTranslation } from "next-i18next";
import MultipleSelectCheckmarks from "./FormControl";
import { useTheme } from "@mui/material/styles";

const AllStates = [
  { name: "Maharashtra", code: "mh" },
  { name: "Gujarat", code: "gj" },
];
const AllDistrict = [
  { name: "Mumbai", code: "MUM" },
  { name: "Pune", code: "PN" },
];
const AllBlocks = [
  { name: "Baner", code: "BA" },
  { name: "Hinjewadi", code: "HJ" },
];
const Sort = ["A-Z", "Z-A"];

const HeaderComponent = ({
  children,
  userType,
  searchPlaceHolder,
  selectedState,
  selectedDistrict,
  selectedBlock,
  selectedSort,
  handleStateChange,
  handleDistrictChange,
  handleBlockChange,
  handleSortChange,
  showStateDropdown = true,
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:986px)");

  const handleStateChangeWrapper = (selectedNames: string[], selectedCodes: string[]) => {
    if (selectedNames[0] === "") {
      handleDistrictChange([], []);
      handleBlockChange([], []);
    }
    handleStateChange(selectedNames, selectedCodes);
  };

  const handleDistrictChangeWrapper = (selected: string[], selectedCodes: string[]) => {
    if (selected[0] === "") {
      handleBlockChange([], []);
    }
    handleDistrictChange(selected, selectedCodes);
  };

  const handleBlockChangeWrapper = (selected: string[], selectedCodes: string[]) => {
    handleBlockChange(selected, selectedCodes);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "8px" : "16px",
        padding: isMobile ? "8px" : "16px",
        backgroundColor: theme.palette.secondary["100"],
        borderRadius: "8px",
      }}
    >
      {showStateDropdown && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.palette.secondary["200"],
            p: isMobile ? "8px" : "16px",
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid container spacing={isMobile ? 1 : 2}>
            <Grid item xs={12} sm={isMediumScreen ? 12 : 4}>
              <MultipleSelectCheckmarks
                names={AllStates.map((state) => state.name)}
                codes={AllStates.map((state) => state.code)}
                tagName={t("FACILITATORS.ALL_STATES")}
                selectedCategories={selectedState}
                onCategoryChange={handleStateChangeWrapper}
              />
            </Grid>
            <Grid item xs={12} sm={isMediumScreen ? 12 : 4}>
              <MultipleSelectCheckmarks
                names={AllDistrict.map((districts) => districts.name)}
                codes={AllDistrict.map((districts) => districts.code)}
                tagName={t("FACILITATORS.ALL_DISTRICTS")}
                selectedCategories={selectedDistrict}
                onCategoryChange={handleDistrictChangeWrapper}
                disabled={selectedState.length === 0 || selectedState[0] === ""}
              />
            </Grid>
            <Grid item xs={12} sm={isMediumScreen ? 12 : 4}>
              <MultipleSelectCheckmarks
                names={AllBlocks.map((blocks) => blocks.name)}
                codes={AllBlocks.map((blocks) => blocks.code)}
                tagName={t("FACILITATORS.ALL_BLOCKS")}
                selectedCategories={selectedBlock}
                onCategoryChange={handleBlockChangeWrapper}
                disabled={selectedDistrict.length === 0 || selectedDistrict[0] === ""}
              />
            </Grid>
          </Grid>
        </Box>
      )}
      <Typography variant="h2" sx={{ mt: isMobile ? "8px" : "16px" }}>
        {userType}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile || isMediumScreen ? "column" : "row",
          gap: isMobile || isMediumScreen ? "8px" : "35%",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <SearchBar
            className="searchBox"
            placeholder={searchPlaceHolder}
            backgroundColor={theme.palette.secondary["300"]}
            fullWidth
          />
        </Box>
        <FormControl sx={{ minWidth: "120px" }}>
          <Select
            value={selectedSort}
            onChange={handleSortChange}
            displayEmpty
            style={{
              borderRadius: "8px",
              height: "40px",
              fontSize: "14px",
            }}
          >
            <MenuItem value="Sort">{t("COMMON.SORT")}</MenuItem>
            {Sort.map((state, index) => (
              <MenuItem value={state} key={index}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "40px",
          width: isMobile || isMediumScreen ? "100%" : "200px",
          borderRadius: "20px",
          border: "1px solid #1E1B16",
          mt: isMobile ? "10px" : "16px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Button
      //  variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            fontSize: "14px",
            color: theme.palette.primary["100"]
          }}
        >
          {t("COMMON.ADD_NEW")}
        </Button>
      </Box>
      {children}
    </Box>
  );
};

export default HeaderComponent;