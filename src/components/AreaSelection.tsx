import { Box, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import React from "react";
import MultipleSelectCheckmarks from "./FormControl";
import { capitalizeFirstLetterOfEachWordInArray} from "@/utils/Helper";
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
interface Centers {
  cohortId: string;
  name: string;
}
interface DropdownBoxProps {
  states: State[];
  districts: District[];
  blocks: Block[];
  allCenters?: Centers[];
  selectedState: string[];
  selectedDistrict: string[];
  selectedBlock: string[];
  selectedCenter?: any;
  inModal?:boolean
  handleStateChangeWrapper: (
    selectedNames: string[],
    selectedCodes: string[],
  ) => Promise<void>;
  handleDistrictChangeWrapper: (
    selected: string[],
    selectedCodes: string[],
  ) => Promise<void>;
  handleBlockChangeWrapper: (
    selected: string[],
    selectedCodes: string[],
  ) => void;
  handleCenterChangeWrapper?: (
    selected: string[],
    selectedCodes: string[],
  ) => void;

  isMobile: boolean;
  isMediumScreen: boolean;
  isCenterSelection?: boolean;
}

const AreaSelection: React.FC<DropdownBoxProps> = ({
  states,
  districts,
  blocks,
  allCenters = [],
  selectedState,
  selectedDistrict,
  selectedBlock,
  selectedCenter = [],
  handleStateChangeWrapper,
  handleDistrictChangeWrapper,
  handleBlockChangeWrapper,
  isMobile,
  isMediumScreen,
  isCenterSelection = false,
  inModal=false,
  handleCenterChangeWrapper = () => {},
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
            names={states?.map(
              (state) =>
                state.label?.toLowerCase().charAt(0).toUpperCase() +
                state.label?.toLowerCase().slice(1),
            )}
            codes={states?.map((state) => state.value)}
            tagName={t("FACILITATORS.STATE")}
            selectedCategories={selectedState}
            onCategoryChange={handleStateChangeWrapper}
            overall={inModal ? false : true}
            defaultValue={t("COMMON.ALL_STATES")}

          />
        </Grid>
        <Grid item xs={12} sm={isMediumScreen ? 12 : 3}>
          <MultipleSelectCheckmarks
            names={districts?.map((districts) => districts.label)}
            codes={districts?.map((districts) => districts.value)}
            tagName={t("FACILITATORS.DISTRICT")}
            selectedCategories={selectedDistrict}
            onCategoryChange={handleDistrictChangeWrapper}
            disabled={selectedState?.length === 0 || (selectedState && selectedState[0] === "")}
            overall={inModal ? false : true}
            defaultValue={t("COMMON.ALL_DISTRICTS")}

          />
        </Grid>
        <Grid item xs={12} sm={isMediumScreen ? 12 : 3}>
          <MultipleSelectCheckmarks
            names={blocks?.map((blocks) => blocks.label)}
            codes={blocks?.map((blocks) => blocks.value)}
            tagName={t("FACILITATORS.BLOCK")}
            selectedCategories={selectedBlock}
            onCategoryChange={handleBlockChangeWrapper}
            disabled={
              selectedDistrict?.length === 0 || (selectedDistrict && selectedDistrict[0] === "")
            }
            overall={inModal ? false : true}
            defaultValue={t("COMMON.ALL_BLOCKS")}
          />
        </Grid>
        {isCenterSelection && (
          <Grid item xs={12} sm={isMediumScreen ? 12 : 3}>
            <MultipleSelectCheckmarks
              names={capitalizeFirstLetterOfEachWordInArray(allCenters?.map((centers) => centers.name))}
              codes={allCenters?.map((centers) => centers.cohortId)}
              tagName={t("CENTERS.CENTERS")}
              selectedCategories={selectedCenter}
              onCategoryChange={handleCenterChangeWrapper}
              disabled={selectedBlock.length === 0 || selectedCenter[0] === ""}
              overall={inModal ? false : true}
              />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AreaSelection;
