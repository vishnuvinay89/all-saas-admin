import * as React from "react";
import { useState } from "react";
import {
  MenuItem,
  Typography,
  Box,
  FormControl,
  useMediaQuery,
} from "@mui/material";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "@/components/layouts/header/SearchBar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useTranslation } from "next-i18next";

interface Facilitator {
  name: string;
  location: string;
}

const AllStates = ["maharashtra", "Gujarat"];
const AllDistrict = ["Kolhapur", "Pune"];
const AllBlocks = ["Kothrud", "Warje"];

const Facilitators: React.FC = () => {
  const [selectedState, setSelectedState] = useState("All states");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedBlock, setSelectedBlock] = useState("All Blocks");
  const { t } = useTranslation();

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleStateChange = (event: SelectChangeEvent) => {
    setSelectedState(event.target.value as string);
  };

  const handleDistrictChange = (event: SelectChangeEvent) => {
    setSelectedDistrict(event.target.value as string);
  };

  const handleBlockChange = (event: SelectChangeEvent) => {
    setSelectedBlock(event.target.value as string);
  };

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
          gap: isMobile ? "0.1px" : "16px",
        }}
      >
        <FormControl sx={{ m: "1rem 0 1rem" }}>
          <Select
            value={selectedState}
            onChange={handleStateChange}
            displayEmpty
            style={{
              borderRadius: "0.5rem",
              width: "117px",
              height: "32px",
              marginBottom: "0rem",
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
        <FormControl sx={{ m: "1rem 0 1rem" }}>
          <Select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            displayEmpty
            style={{
              borderRadius: "0.5rem",
              width: "117px",
              height: "32px",
              marginBottom: "0rem",
              fontSize: "14px",
            }}
          >
            <MenuItem value="All Districts">
            {t("FACILITATORS.ALL_DISTRICTS")}
            </MenuItem>
            {AllDistrict.map((state, index) => (
              <MenuItem value={state} key={index}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: "1rem 0 1rem" }}>
          <Select
            value={selectedBlock}
            onChange={handleBlockChange}
            displayEmpty
            style={{
              borderRadius: "0.5rem",
              width: "117px",
              height: "32px",
              marginBottom: "0rem",
              fontSize: "14px",
            }}
          >
            <MenuItem value="All Blocks">All Blocks</MenuItem>
            {AllBlocks.map((state, index) => (
              <MenuItem value={state} key={index}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Typography>
      {t("SIDEBAR.FACILITATORS")}

      </Typography>
      <SearchBar placeholder={ t("NAVBAR.SEARCHBAR_PLACEHOLDER")} backgroundColor="#EEEEEE" />

      <Box
        sx={{
          display: "flex",
          // flexDirection: isMobile ? "column" : "row",
          // gap:"px",
          justifyContent: "center",
          height: "40px",
          padding: "0px 16px",
          alignItems: "center",
          width: "100px",
          borderRadius: "20px",
          border: "1px solid var(--M3-ref-neutral-neutral10, #1E1B16)",
        }}
      >
        <Typography>{t("COMMON.ADD_NEW")}</Typography>
        <AddIcon />
      </Box>
    </Box>
  );
};
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
export default Facilitators;
