import * as React from "react";
import { useState, useEffect } from "react";
import {
  MenuItem,
  Typography,
  Box,
  FormControl,
  useMediaQuery,
  Grid,
  Button,
  InputLabel,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "@/components/layouts/header/SearchBar";
import { useTranslation } from "next-i18next";
import MultipleSelectCheckmarks from "./FormControl";
import { useTheme } from "@mui/material/styles";
import {
  getBlockList,
  getStateList,
  getDistrictList,
} from "../services/MasterDataService";
import AreaSelection from "./AreaSelection";

interface State {
  value: string;
  label: string;
}

interface District {
  value: string;
  label: string;
}

interface Block {
  value: string;
  label: string;
}
const Sort = ["A-Z", "Z-A"];
const Filter = ["Active", "Archived"];

const HeaderComponent = ({
  children,
  userType,
  searchPlaceHolder,
  selectedState,
  selectedDistrict,
  selectedBlock,
  selectedSort,
  selectedFilter,
  handleStateChange,
  handleDistrictChange,
  handleBlockChange,
  handleSortChange,
  handleFilterChange,
  showSort,
  showAddNew,
  showStateDropdown = true,
  handleSearch,
  handleAddUserClick,
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:986px)");
  const [allStates, setAllStates] = useState<State[]>([]);
  const [allDistricts, setAllDistricts] = useState<District[]>([]);
  const [allBlocks, setAllBlocks] = useState<Block[]>([]);

  const handleStateChangeWrapper = async (
    selectedNames: string[],
    selectedCodes: string[]
  ) => {
    if (selectedNames[0] === "") {
      // if(allDistricts.length!==0)
      // {
      //   handleDistrictChange([], []);
      //   handleBlockChange([], []);
      // }
    }
    try {
      const response = await getDistrictList(selectedCodes);
      const result = response?.result;
      setAllDistricts(result);
    } catch (error) {
      console.log(error);
    }
    handleStateChange(selectedNames, selectedCodes);
  };

  const handleDistrictChangeWrapper = async (
    selected: string[],
    selectedCodes: string[]
  ) => {
    if (selected[0] === "") {
      handleBlockChange([], []);
    }
    try {
      const response = await getBlockList(selectedCodes);
      const result = response?.result;
      setAllBlocks(result);
    } catch (error) {
      console.log(error);
    }
    handleDistrictChange(selected, selectedCodes);
  };

  const handleBlockChangeWrapper = (
    selected: string[],
    selectedCodes: string[]
  ) => {
    handleBlockChange(selected, selectedCodes);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStateList();
        const result = response?.result;
        setAllStates(result);
        console.log(typeof allStates);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

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
        <AreaSelection
        allStates={allStates}
        allDistricts={allDistricts}
        allBlocks={allBlocks}
        selectedState={selectedState}
        selectedDistrict={selectedDistrict}
        selectedBlock={selectedBlock}
        handleStateChangeWrapper={handleStateChangeWrapper}
        handleDistrictChangeWrapper={handleDistrictChangeWrapper}
        handleBlockChangeWrapper={handleBlockChangeWrapper}
        isMobile={isMobile}
        isMediumScreen={isMediumScreen}
      />
      )}
      <Typography variant="h2" sx={{ mt: isMobile ? "12px" : "20px" }}>
        {userType}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile || isMediumScreen ? "column" : "row",
          gap: isMobile || isMediumScreen ? "8px" : "5%",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <SearchBar onSearch={handleSearch} placeholder={searchPlaceHolder} />
        </Box>
        <Box display={"flex"} gap={1}>
          <FormControl sx={{ minWidth: "120px" }}>
            <Select
              value={selectedFilter}
              onChange={handleFilterChange}
              displayEmpty
              style={{
                borderRadius: "8px",
                height: "40px",
                fontSize: "14px",
              }}
            >
              <MenuItem value="All">
                <em>All</em>
              </MenuItem>
              {Filter?.map((filter, index) => (
                <MenuItem value={filter} key={index}>
                  {filter}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {showSort && (
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
          )}
        </Box>
      </Box>
      {showAddNew && (
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
              color: theme.palette.primary["100"],
            }}
          >
            {t("COMMON.ADD_NEW")}
          </Button>
        </Box>
      )}
      {children}
    </Box>
  );
};

export default HeaderComponent;