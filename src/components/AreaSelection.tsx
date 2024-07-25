import React from 'react';
import { Box, Grid } from "@mui/material";
import MultipleSelectCheckmarks from "./FormControl";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
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
interface DropdownBoxProps {
  allStates: State[];
  allDistricts: District[];
  allBlocks: Block[];
  selectedState: string[];
  selectedDistrict: string[];
  selectedBlock: string[];
  handleStateChangeWrapper: (selectedNames: string[], selectedCodes: string[]) => Promise<void>;
  handleDistrictChangeWrapper: (selected: string[], selectedCodes: string[]) => Promise<void>;
  handleBlockChangeWrapper: (selected: string[], selectedCodes: string[]) => void;
  isMobile: boolean;
  isMediumScreen: boolean;
}

const AreaSelection: React.FC<DropdownBoxProps> = ({
  allStates,
  allDistricts,
  allBlocks,
  selectedState,
  selectedDistrict,
  selectedBlock,
  handleStateChangeWrapper,
  handleDistrictChangeWrapper,
  handleBlockChangeWrapper,
  isMobile,
  isMediumScreen,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  return (
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
        <Grid item xs={12} sm={isMediumScreen ? 12 : 3}>
          <MultipleSelectCheckmarks
            names={allStates.map(
              (state) =>
                state.label?.toLowerCase().charAt(0).toUpperCase() +
                state.label?.toLowerCase().slice(1),
            )}
            codes={allStates.map((state) => state.value)}
            tagName={t("FACILITATORS.ALL_STATES")}
            selectedCategories={selectedState}
            onCategoryChange={handleStateChangeWrapper}
          />
        </Grid>
        <Grid item xs={12} sm={isMediumScreen ? 12 : 3}>
          <MultipleSelectCheckmarks
            names={allDistricts.map((districts) => districts.label)}
            codes={allDistricts.map((districts) => districts.value)}
            tagName={t("FACILITATORS.ALL_DISTRICTS")}
            selectedCategories={selectedDistrict}
            onCategoryChange={handleDistrictChangeWrapper}
            disabled={selectedState.length === 0 || selectedState[0] === ""}
          />
        </Grid>
        <Grid item xs={12} sm={isMediumScreen ? 12 : 3}>
          <MultipleSelectCheckmarks
            names={allBlocks.map((blocks) => blocks.label)}
            codes={allBlocks.map((blocks) => blocks.value)}
            tagName={t("FACILITATORS.ALL_BLOCKS")}
            selectedCategories={selectedBlock}
            onCategoryChange={handleBlockChangeWrapper}
            disabled={
              selectedDistrict.length === 0 || selectedDistrict[0] === ""
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AreaSelection;
