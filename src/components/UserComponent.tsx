import * as React from "react";
import { useState } from "react";
import { MenuItem, Typography, Box, FormControl, useMediaQuery } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "@/components/layouts/header/SearchBar";
import { useTranslation } from "next-i18next";
import MultipleSelectCheckmarks from "./FormControl";
const AllStates = [
  { name: "Maharashtra", code: "mh" },
  { name: "Gujarat", code: "gj" }
];
const AllDistrict = [
  { name: "Mumbai", code: "MUM" },
  { name: "Pune", code: "PN" }
];
const AllBlocks = [
  { name: "Baner", code: "BA" },
  { name: "Hinjewadi", code: "HJ" }
];

//const AllBlocks = ["Kothrud", "Warje"];
const Sort = ["A-Z", "Z-A"];

const UserComponent = ({
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

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleStateChangeWrapper = (selectedNames: string[], selectedCodes: string[]) => {
    console.log(selectedNames)
    if(selectedNames[0]==="")
    {
      console.log(true)
      handleDistrictChange([], []);
      handleBlockChange([], [])
    }
    handleStateChange(selectedNames, selectedCodes);
  
  };

  const handleDistrictChangeWrapper = (selected: string[], selectedCodes: string[]) => {
    if(selected[0]==="")
    {
      console.log(true)
      handleBlockChange([], [])
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
        gap: isMobile ? "0.1px" : "16px",
      }}
    >
      {showStateDropdown && (
        <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", width: isMobile ? "90%" : "100%", backgroundColor: "#EEEEEE", p: isMobile ? "0.5rem" : "1rem" }}>
          <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "0.5rem" : "2rem", width: "100%" }}>
            <MultipleSelectCheckmarks
              names={AllStates.map(state => state.name)}
              codes={AllStates.map(state => state.code)}
              tagName={t("FACILITATORS.ALL_STATES")}
              selectedCategories={selectedState}
              onCategoryChange={handleStateChangeWrapper}
            />
            <MultipleSelectCheckmarks
              names={AllDistrict.map(districts => districts.name)}
              codes={AllDistrict.map(districts => districts.code)} // Assuming codes for districts are the same as names
              tagName={t("FACILITATORS.ALL_DISTRICTS")}
              selectedCategories={selectedDistrict}
              onCategoryChange={handleDistrictChangeWrapper}
              disabled={selectedState.length === 0 ||selectedState[0]=== ""}
            />
            <MultipleSelectCheckmarks
             names={AllBlocks.map(blocks => blocks.name)}
             codes={AllBlocks.map(blocks => blocks.code)}// Assuming codes for blocks are the same as names
              tagName={t("FACILITATORS.ALL_BLOCKS")}
              selectedCategories={selectedBlock}
              onCategoryChange={handleBlockChange}
              disabled={selectedDistrict.length === 0|| selectedDistrict[0]=== ""}
            />
          </Box>
        </Box>
      )}
      <Typography>{userType}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "35%",
        }}
      >
        <Box>
          <SearchBar
            className="searchBox"
            placeholder={searchPlaceHolder}
            backgroundColor="#EEEEEE"
          />
        </Box>
        <FormControl>
          <Select
            value={selectedSort}
            onChange={handleSortChange}
            displayEmpty
            style={{
              borderRadius: "0.5rem",
              width: "117px",
              height: "32px",
              marginBottom: "0rem",
              fontSize: "14px",
            }}
          >
            <MenuItem value="Sort">Sort</MenuItem>
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
          height: "40px",
          padding: "0px 16px",
          alignItems: "center",
          width: "100px",
          borderRadius: "20px",
          border: "1px solid var(--M3-ref-neutral-neutral10, #1E1B16)",
          marginTop: isMobile ? "10px" : null,
        }}
      >
        <Typography>{t("COMMON.ADD_NEW")}</Typography>
        <AddIcon />
      </Box>
      {children}
    </Box>
  );
};

export default UserComponent;
