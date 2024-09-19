import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import MultipleSelectCheckmarks from "./FormControl";
import { capitalizeFirstLetterOfEachWordInArray} from "@/utils/Helper";
import {  useMediaQuery } from "@mui/material";
import { Role } from "@/utils/app.constant";

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
  inModal?: boolean;
  handleStateChangeWrapper: (
    selectedNames: string[],
    selectedCodes: string[]
  ) => Promise<void>;
  handleDistrictChangeWrapper: (
    selected: string[],
    selectedCodes: string[]
  ) => Promise<void>;
  handleBlockChangeWrapper: (
    selected: string[],
    selectedCodes: string[]
  ) => void;
  handleCenterChangeWrapper?: (
    selected: string[],
    selectedCodes: string[]
  ) => void;

  isMobile: boolean;
  isMediumScreen: boolean;
  isCenterSelection?: boolean;
  stateDefaultValue?:string;
  userType?: string;
  reAssignModal?:boolean;
  blockDefaultValue?:string;
  districtDefaultValue?:string
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
  inModal = false,
  handleCenterChangeWrapper = () => {},
  stateDefaultValue,
  blockDefaultValue,
  districtDefaultValue,
  
  userType,
  reAssignModal=false
}) => {

console.log(selectedState.length)
  const { t } = useTranslation();
  const theme = useTheme<any>();
const [singleState, setSingleState] = useState <boolean>(true);
const [stateValue, setStateValue] = useState <string>("");
const [stateCode, setStateCode] = useState <string>("");
let isSmallScreen = useMediaQuery((theme: any) =>
theme.breakpoints.down("sm"),
);
// isSmallScreen=isMobile?true: false;
const blockDisable= districtDefaultValue?false: true
const shouldRenderSelectCheckmarks =
!(reAssignModal && userType === Role.TEAM_LEADERS);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        //backgroundColor: theme.palette.secondary["200"],
        // p: isMobile ? "8px" : "16px",
        borderRadius: "8px",
        // boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      
       <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen || isMediumScreen ? "column" : "row",
        }}
      >
        {userType && !reAssignModal && (
          <Typography marginTop="20px" variant="h1">
            {userType}
          </Typography>
        )}
        {!isSmallScreen && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: inModal ? "center" : "flex-end",
              marginLeft: inModal ? undefined : "auto",
            }}
          ></Box>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: isSmallScreen ? "center" : undefined,
            justifyContent: isSmallScreen ? "center" : undefined,
          }}
        >
          <MultipleSelectCheckmarks
            names={states?.map(
              (state) =>
                state.label?.toLowerCase().charAt(0).toUpperCase() +
                state.label?.toLowerCase().slice(1)
            )}
            codes={states?.map((state) => state.value)}
            tagName={t("FACILITATORS.STATE")}
            selectedCategories={selectedState}
            onCategoryChange={handleStateChangeWrapper}
            disabled={
              stateDefaultValue === t("COMMON.ALL_STATES") ? false : true
            }
            overall={!inModal}
            defaultValue={stateDefaultValue}
          />
          <MultipleSelectCheckmarks
            names={districts?.map((districts) => districts.label)}
            codes={districts?.map((districts) => districts.value)}
            tagName={t("FACILITATORS.DISTRICT")}
            selectedCategories={selectedDistrict}
            onCategoryChange={handleDistrictChangeWrapper}
            disabled={
              districts?.length <= 0 ||
              (selectedState.length === 0 &&
                stateDefaultValue === t("COMMON.ALL_STATES"))
            }
            overall={!inModal}
            defaultValue={
              //districtDefaultValue? districtDefaultValue:

              reAssignModal
                ? districtDefaultValue
                : selectedState.length > 0 && districts?.length === 0
                ? t("COMMON.NO_DISTRICTS")
                : t("COMMON.ALL_DISTRICTS")
            }
          />
         { shouldRenderSelectCheckmarks &&( <MultipleSelectCheckmarks
            names={capitalizeFirstLetterOfEachWordInArray(
              blocks?.map((blocks) => blocks.label)
            )}
            codes={blocks?.map((blocks) => blocks.value)}
            tagName={t("FACILITATORS.BLOCK")}
            selectedCategories={capitalizeFirstLetterOfEachWordInArray(selectedBlock)}
            onCategoryChange={handleBlockChangeWrapper}
            disabled={
           //  blockDefaultValue? false:

              blocks?.length <= 0 ||
              selectedDistrict?.length === 0 ||
              (selectedDistrict && selectedDistrict[0] === "") ||
              selectedDistrict[0] === t("COMMON.ALL_DISTRICTS")
            }
            overall={!inModal}
            defaultValue={ 
            //  blockDefaultValue? blockDefaultValue:
              selectedDistrict?.length > 0 && blocks?.length <= 0
                ? t("COMMON.NO_BLOCKS")
                : t("COMMON.ALL_BLOCKS")
            }
          />)
}


         { isCenterSelection && ( <MultipleSelectCheckmarks
              names={capitalizeFirstLetterOfEachWordInArray(allCenters?.map((centers) => centers.name))}
              codes={allCenters?.map((centers) => centers.cohortId)}
              tagName={t("CENTERS.CENTERS")}
              selectedCategories={selectedCenter}
              onCategoryChange={handleCenterChangeWrapper}
              disabled={selectedBlock.length === 0 || selectedCenter[0] === ""}
              overall={!inModal}
              defaultValue={ 
                //  blockDefaultValue? blockDefaultValue:
                  selectedBlock?.length > 0 && blocks?.length <= 0
                    ? t("COMMON.NO_CENTERS")
                    : t("COMMON.ALL_CENTERS")
                }
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AreaSelection;
