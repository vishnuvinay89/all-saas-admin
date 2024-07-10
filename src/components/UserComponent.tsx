import * as React from "react";
import { useState, useEffect } from "react";
import {
  MenuItem,
  Typography,
  Box,
  FormControl,
  useMediaQuery,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "@/components/layouts/header/SearchBar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const AllStates = ["maharashtra", "Gujarat"];
const AllDistrict = ["Kolhapur", "Pune"];
const AllBlocks = ["Kothrud", "Warje"];
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
}: any) => {
  const { t } = useTranslation();

  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "0.1px" : "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: isMobile ? "90%" : "100%",
          backgroundColor: "#EEEEEE",
          p: isMobile ? "0.5rem" : "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "0.5rem" : "2rem",
            width: "100%",
          }}
        >
          <FormControl
            sx={{
              width: isMobile ? "100%" : "auto",
              mb: isMobile ? "0.5rem" : "0",
            }}
          >
            <Select
              value={selectedState}
              onChange={handleStateChange}
              displayEmpty
              sx={{
                borderRadius: "0.5rem",
                width: "117px",
                height: "32px",
                fontSize: "14px",
              }}
            >
              <MenuItem value="All states">
                {t("FACILITATORS.ALL_STATES")}
              </MenuItem>
              {AllStates.map((state, index) => (
                <MenuItem value={state} key={index}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              width: isMobile ? "100%" : "auto",
              mb: isMobile ? "0.5rem" : "0",
            }}
          >
            <Select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              displayEmpty
              sx={{
                borderRadius: "0.5rem",
                width: "117px",
                height: "32px",
                fontSize: "14px",
              }}
            >
              <MenuItem value="All Districts">
                {t("FACILITATORS.ALL_DISTRICTS")}
              </MenuItem>
              {AllDistrict.map((district, index) => (
                <MenuItem value={district} key={index}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              width: isMobile ? "100%" : "auto",
            }}
          >
            <Select
              value={selectedBlock}
              onChange={handleBlockChange}
              displayEmpty
              sx={{
                borderRadius: "0.5rem",
                width: "117px",
                height: "32px",
                fontSize: "14px",
              }}
            >
              <MenuItem value="All Blocks">All Blocks</MenuItem>
              {AllBlocks.map((block, index) => (
                <MenuItem value={block} key={index}>
                  {block}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
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
