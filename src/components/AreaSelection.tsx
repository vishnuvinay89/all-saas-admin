import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import MultipleSelectCheckmarks from "./FormControl";
import { capitalizeFirstLetterOfEachWordInArray } from "@/utils/Helper";
import { useMediaQuery } from "@mui/material";
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
interface Tenant {
  value: string;
  label: string;
}

interface Cohort {
  value: string;
  label: string;
}
interface DropdownBoxProps {
  // states: State[];
  // districts: District[];
  // blocks: Block[];
  // allCenters?: Centers[];
  // selectedState: string[];
  // selectedDistrict: string[];
  // selectedBlock: string[];
  // selectedCenter?: any;
  inModal?: boolean;
  // handleStateChangeWrapper: (
  //   selectedNames: string[],
  //   selectedCodes: string[]
  // ) => Promise<void>;
  // handleDistrictChangeWrapper: (
  //   selected: string[],
  //   selectedCodes: string[]
  // ) => Promise<void>;
  // handleBlockChangeWrapper: (
  //   selected: string[],
  //   selectedCodes: string[]
  // ) => void;
  // handleCenterChangeWrapper?: (
  //   selected: string[],
  //   selectedCodes: string[]
  // ) => void;

  isMobile: boolean;
  isMediumScreen: boolean;
  isCenterSelection?: boolean;
  stateDefaultValue?: string;
  userType?: string;
  reAssignModal?: boolean;
  blockDefaultValue?: string;
  districtDefaultValue?: string;
  tenants: Tenant[];
  cohorts: Cohort[];
  selectedTenant: string[];
  selectedCohort: string[];
  handleTenantChange: (selected: string[]) => void;
  handleCohortChange: (selected: string[]) => void;
  tenantDefaultValue?: string;
  cohortDefaultValue?: string;
  isTenantShow?: boolean;
  isCohortShow?: boolean;
}

const AreaSelection: React.FC<DropdownBoxProps> = ({
  // states,
  // districts,
  // blocks,
  // allCenters = [],
  // selectedState,
  // selectedDistrict,
  // selectedBlock,
  // selectedCenter = [],
  // handleStateChangeWrapper,
  // handleDistrictChangeWrapper,
  // handleBlockChangeWrapper,
  isMobile,
  isMediumScreen,
  isCenterSelection = false,
  inModal = false,
  // handleCenterChangeWrapper = () => {},
  // stateDefaultValue,
  // blockDefaultValue,
  // districtDefaultValue,
  tenants,
  cohorts,
  selectedTenant,
  selectedCohort,
  handleTenantChange,
  handleCohortChange,
  tenantDefaultValue,
  cohortDefaultValue,
  userType,
  reAssignModal = false,
  isTenantShow = false,
  isCohortShow = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [singleState, setSingleState] = useState<boolean>(true);
  const [stateValue, setStateValue] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("");
  let isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );
  // isSmallScreen=isMobile?true: false;
  // const blockDisable = districtDefaultValue ? false : true;
  const shouldRenderSelectCheckmarks = !(
    reAssignModal && userType === Role.TEAM_LEADERS
  );

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "end",
        flexDirection: "row",
        gap: "20%",
        "@media (max-width: 900px)": {
          flexDirection: "column",
          gap: 2,
        },
      }}
    >
      {userType && !reAssignModal && (
        <Box>
          <Typography marginTop="20px" variant="h1">
            {userType}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          width: inModal ? "100%" : "90%",
          "@media (max-width: 900px)": {
            width: "100%",
          },
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "end",
          }}
        >
          {isTenantShow && (
            <Grid
              item
              xs={12}
              sm={inModal ? 12 : 6}
              md={inModal ? 12 : 6}
              lg={inModal ? 12 : isCenterSelection ? 6 : 6}
            >
              <MultipleSelectCheckmarks
                names={
                  Array.isArray(tenants)
                    ? tenants.map(
                        (tenant: any) =>
                          tenant.label?.toLowerCase().charAt(0).toUpperCase() +
                          tenant.label?.toLowerCase().slice(1)
                      )
                    : []
                }
                codes={
                  Array.isArray(tenants)
                    ? tenants.map((tenant: Tenant) => tenant.value)
                    : []
                }
                tagName={t("TENANT.TENANT_MEMBER")}
                selectedCategories={selectedTenant}
                onCategoryChange={handleTenantChange}
                overall={!inModal}
                defaultValue={tenantDefaultValue}
              />
            </Grid>
          )}

          {isCohortShow && (
            <Grid
              item
              xs={12}
              sm={inModal ? 12 : 6}
              md={inModal ? 12 : 6}
              lg={inModal ? 12 : isCenterSelection ? 6 : 6}
            >
              <MultipleSelectCheckmarks
                names={
                  Array.isArray(cohorts)
                    ? cohorts.map((cohort: any) => cohort.label)
                    : []
                }
                codes={
                  Array.isArray(cohorts)
                    ? cohorts.map((cohort: any) => cohort.cohortId)
                    : []
                }
                tagName={t("COHORTS.COHORT_MEMBER")}
                selectedCategories={selectedCohort}
                onCategoryChange={handleCohortChange}
                // disabled={
                //   !Array.isArray(cohorts) ||
                //   cohorts.length <= 0 ||
                //   (selectedTenant?.length === 0 &&
                //     tenantDefaultValue === t("COHORTS.ALL_STATES"))
                // }
                overall={!inModal}
                defaultValue={cohortDefaultValue}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default AreaSelection;

{
  /* <Grid
  item
  xs={12}
  sm={inModal ? 12 : 6}
  md={inModal ? 12 : 4}
  lg={inModal ? 12 : isCenterSelection ? 3 : 4}
>
  {shouldRenderSelectCheckmarks && (
    <MultipleSelectCheckmarks
      names={capitalizeFirstLetterOfEachWordInArray(
        blocks?.length > 0 ? blocks.map((block) => block.label) : []
        //  blocks.map((block) => block.label)
      )}
      codes={
        blocks?.length > 0
          ? blocks?.map((block) => block.value)
          : []
        // blocks?.map((block) => block.value)
      }
      tagName={t("FACILITATORS.BLOCK")}
      selectedCategories={capitalizeFirstLetterOfEachWordInArray(
        selectedBlock
      )}
      onCategoryChange={handleBlockChangeWrapper}
      disabled={
        blocks?.length <= 0 ||
        selectedDistrict?.length === 0 ||
        selectedDistrict[0] === t("COMMON.ALL_DISTRICTS")
      }
      overall={!inModal}
      defaultValue={
        selectedDistrict?.length > 0 && blocks?.length === 0
          ? t("COMMON.NO_BLOCKS")
          : t("COMMON.ALL_BLOCKS")
      }
    />
  )}
</Grid> */
}
{
  /* {isCenterSelection && (
  <Grid
    item
    xs={12}
    sm={inModal ? 12 : 6}
    md={inModal ? 12 : 4}
    lg={inModal ? 12 : isCenterSelection ? 3 : 4}
  >
    <MultipleSelectCheckmarks
      names={capitalizeFirstLetterOfEachWordInArray(
        allCenters?.map((center) => center.name)
      )}
      codes={allCenters?.map((center) => center.cohortId)}
      tagName={t("CENTERS.CENTERS")}
      selectedCategories={selectedCenter}
      onCategoryChange={handleCenterChangeWrapper}
      disabled={
        selectedBlock.length === 0 ||
        selectedBlock[0] === t("COMMON.ALL_BLOCKS") ||
        (selectedBlock?.length > 0 && allCenters?.length === 0)
      }
      overall={!inModal}
      defaultValue={
        selectedBlock?.length > 0 && allCenters?.length === 0
          ? t("COMMON.NO_CENTERS")
          : t("COMMON.ALL_CENTERS")
      }
    />
  </Grid>
)} */
}
