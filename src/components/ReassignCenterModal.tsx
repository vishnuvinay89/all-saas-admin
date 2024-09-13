import {
  Box,
  Checkbox,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { showToastMessage } from "./Toastify";
import CustomModal from "./CustomModal";
import SearchIcon from "@mui/icons-material/Search";
import { Role } from "@/utils/app.constant";
import { bulkCreateCohortMembers } from "@/services/CohortService/cohortService";
import { getCenterList } from "@/services/MasterDataService";
import { getUserDetailsInfo } from "@/services/UserList";
import { updateUser } from "@/services/CreateUserService";
import { useLocationState } from "@/utils/useLocationState";
import AreaSelection from "./AreaSelection";
import { transformArray } from "../utils/Helper";

interface ReassignCohortModalProps {
  open: boolean;
  onClose: () => void;
  cohortData?: any;
  userId?: string;
  userType?: string;
  blockList?:any,
  blockName?: any,
  blockCode?:any,
  districtName?: any,
  districtCode?:any,
  cohortId?:any
  centers: any
}

interface Cohort {
  id?: any;
  cohortId?: string;
  name?: string;
}

const ReassignCenterModal: React.FC<ReassignCohortModalProps> = ({
  open,
  onClose,
  cohortData,
  userId,
  userType,
  blockList,
  blockName,
  cohortId,
  blockCode,
  districtName,
  districtCode,
  centers
  
}) => { 
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const roleType = userType;
  const defaultBlock=blockName;

const {
    states,
    districts,
    blocks,
    allCenters,
    isMobile,
    isMediumScreen,
    selectedState,
    selectedStateCode,
    selectedDistrict,
    selectedDistrictCode,
    selectedCenter,
    dynamicForm,
    selectedBlock,
    selectedBlockCode,
    handleStateChangeWrapper,
    handleDistrictChangeWrapper,
    handleBlockChangeWrapper,
    handleCenterChangeWrapper,
    selectedCenterCode,
    selectedBlockCohortId,
    blockFieldId,
    districtFieldId,
    stateFieldId,
    dynamicFormForBlock,
    stateDefaultValue,
    setSelectedBlock,
    setSelectedDistrict,
    setSelectedDistrictCode,
    setSelectedBlockCode
  } =useLocationState(open, onClose, roleType, true)
  
  let cohorts: Cohort[] = allCenters?.map(
    (cohort: { cohortId: any; name: string }) => ({
      name: cohort.name,
      id: cohort.cohortId,
    })
  );

  console.log(centers?.split(',').map((center :any)=> center.trim()))
  console.log(blockCode)
  const names = cohortData.map((item : any)=> item.name);

  console.log(names); 
 
    const [searchInput, setSearchInput] = useState("");

  //const [selectedBlockId, setselectedBlockId] = useState(blockName);

  // const [checkedCenters, setCheckedCenters] = useState<string[]>([blockCode]);
  const [checkedCenters, setCheckedCenters] = useState<string[]>([]);


  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value.toLowerCase());
  };

  const handleClose = () => {
   
    setCheckedCenters([]);
    onClose();
  };

  const handleToggle = (name: string) => {
    setCheckedCenters((prev) =>
      prev.includes(name)
        ? prev.filter((center) => center !== name)
        : [...prev, name]
    );
  };
  console.log(checkedCenters)

  console.log(userType)

  const handleReassign = async () => {
    try {
      let selectedData;
      let unSelectedData: string[];
      if(userType!== Role.TEAM_LEADERS)
      {
        selectedData = cohorts
      .filter((center) => center?.name && checkedCenters.includes(center.name))
      .map((center) => center!.id);
    
     unSelectedData = cohorts
      .filter((center) => center?.name && !checkedCenters.includes(center.name))
      .map((center) => center!.id);
      
      }
      else
      {
        selectedData = blocks
        .filter((center) => center?.value && checkedCenters.includes(center.value))
        .map((center) => center!.value);
      
       unSelectedData= blocks
        .filter((center) => center?.value && !checkedCenters.includes(center.value))
        .map((center) => center!.value);
      }
      console.log(unSelectedData)

const labelArray = filteredCBlocks
  ?.filter((block: any) => unSelectedData?.includes(block.value))
  .map((block: any) => block.label);

      console.log(blocks)
      console.log(selectedData)

      let payload;
      if (userType !== Role.TEAM_LEADERS) {
        payload = {
          userId: [userId],
          cohortId: selectedData,
          removeCohortId: unSelectedData.length===0?cohortId:unSelectedData,
        };
  
        await bulkCreateCohortMembers(payload);
        let customFields;
        
        if(selectedBlock[0]!==blockName)
          {  
            
            const userDetails = await getUserDetailsInfo(userId);
            const blockField = userDetails?.userData?.customFields.find(
              (field: any) => field.label === "BLOCKS"
            );
            customFields = [
             
              {
                fieldId: blockField.fieldId,
                value: selectedBlockCode,
              },
  
            ];
           

         if(selectedDistrict[0]!==districtName)
        {
          const userDetails = await getUserDetailsInfo(userId);
          const blockField = userDetails?.userData?.customFields.find(
            (field: any) => field.label === "BLOCKS"
          );
          customFields = [
            {
              fieldId: districtFieldId,
              value: selectedDistrictCode,
            },
            {
              fieldId: blockField.fieldId,
              value: selectedBlockCode,
            },

          ];
        
        }
        }
        
        
        const updateObject = {
          userData: {},
          customFields: customFields,
        };
        if (userId) {
          await updateUser(userId, updateObject);
        }
        handleClose();
        
  
      
        showToastMessage(
          t(
            userType === Role.TEAM_LEADERS
              ? "COMMON.BLOCKS_REASSIGN_SUCCESSFULLY"
              : "COMMON.CENTERS_REASSIGN_SUCCESSFULLY"
          ),
          "success"
        );
      } else {
        const reassignBlockObject = {
          limit: 200,
          offset: 0,
          filters: {
            status: ["active"],
            name: checkedCenters[0],
          },
        };
  
        const response = await getCenterList(reassignBlockObject);
        const cohortDetails = response?.result?.results?.cohortDetails;
        const selectedBlockCohortId = cohortDetails?.find(
          (item: any) => item?.type === "BLOCK"
        )?.cohortId;
  
        if (!selectedBlockCohortId) {
          showToastMessage(
            t("COMMON.COHORT_ID_NOT_FOUND", { block: checkedCenters[0] }),
            "info"
          );
          return;
        }
  
        const previousBlockObject = {
          limit: 200,
          offset: 0,
          filters: {
            status: ["active"],
            name: blockName,
          },
        };
  
        const previousResponse = await getCenterList(previousBlockObject);
        const previousCohortDetails = previousResponse?.result?.results?.cohortDetails;
        const previousBlockId = previousCohortDetails?.find(
          (item: any) => item?.type === "BLOCK"
        )?.cohortId;
  
        payload = {
          userId: [userId],
          cohortId: [selectedBlockCohortId],
          removeCohortId: [previousBlockId],
        };
  
        await bulkCreateCohortMembers(payload);
        handleClose();
  
        const userDetails = await getUserDetailsInfo(userId);
        const blockField = userDetails?.userData?.customFields.find(
          (field: any) => field.label === "BLOCKS"
        );
  
        let customFields = [
          {
            fieldId: blockField.fieldId,
            value: checkedCenters[0],
          },
        ];
        if(selectedDistrict[0]!==districtName)
           {
            customFields = [
              {
                fieldId: blockField.fieldId,
                value: checkedCenters[0],
              },
              {
                fieldId: districtFieldId,
                value: selectedDistrictCode,
              },
            ];
           }
        const updateObject = {
          userData: {},
          customFields: customFields,
        };
        if (userId) {

          await updateUser(userId, updateObject);
        }
  
        showToastMessage(
          t("COMMON.BLOCKS_REASSIGN_SUCCESSFULLY"),
          "success"
        );
      }
    } catch (error) {
      showToastMessage(
        t(
          userType === Role.TEAM_LEADERS
            ? "COMMON.BLOCKS_REASSIGN_FAILED"
            : "COMMON.CENTERS_REASSIGN_FAILED"
        ),
        "error"
      );
    }
  };


  let filteredCohorts = cohorts?.filter((cohort) =>
    cohort?.name?.toLowerCase().includes(searchInput)
  );
  console.log(filteredCohorts)
  // const filteredCBlocks = blocks?.filter((cohort: any) =>
  //   cohort.label.toLowerCase().includes(searchInput)
  // );
 let filteredCBlocks = blocks?.filter((cohort: any) =>
  cohort.label.toLowerCase().includes(searchInput)
).map((cohort: any) => ({
  label: cohort.label,
  value: cohort.value,
}));
  const handleToggle2 = (centerName: string) => {
    // If the selected center is already checked, uncheck it
    if (checkedCenters.includes(centerName)) {
      setCheckedCenters([]);
    } else {
      // Otherwise, clear any previous selection and check the new one
      setCheckedCenters([centerName]);
    }
  };
  
 
  return (
    <>
      <CustomModal
        open={open}
        handleClose={handleClose}
        title= {userType===Role.TEAM_LEADERS? t("COMMON.REASSIGN_BLOCKS"):t("COMMON.REASSIGN_CENTERS")}
        primaryBtnText={t("Reassign")}
        primaryBtnClick={handleReassign}
        primaryBtnDisabled={checkedCenters.length === 0}
      >
<AreaSelection
            states={transformArray(states)}
            districts={transformArray(districts)}
            blocks={transformArray(blocks)}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedBlock={selectedBlock}
            handleStateChangeWrapper={handleStateChangeWrapper}
            handleDistrictChangeWrapper={handleDistrictChangeWrapper}
            handleBlockChangeWrapper={handleBlockChangeWrapper}
            isMobile={true}
            isMediumScreen={isMediumScreen}
            isCenterSelection={false}
            allCenters={allCenters}
            selectedCenter={selectedCenter}
            handleCenterChangeWrapper={handleCenterChangeWrapper}
            inModal={true}
            stateDefaultValue={stateDefaultValue}
            reAssignModal={true}
            userType={userType}
          //  selectedState={selectedState}

            districtDefaultValue={districtName}
            blockDefaultValue={userType===Role.TEAM_LEADERS?undefined:blockName}
          />
        <Box sx={{ p: 1 }}>
          <TextField
            sx={{
              backgroundColor: theme.palette.warning["A700"],
              borderRadius: 8,
              "& .MuiOutlinedInput-root fieldset": { border: "none" },
              "& .MuiOutlinedInput-input": { borderRadius: 8 },
            }}
            placeholder={ userType===Role.TEAM_LEADERS?t("MASTER.SEARCHBAR_PLACEHOLDER_BLOCK"): t("CENTERS.SEARCHBAR_PLACEHOLDER")}
            value={searchInput}
            onChange={handleSearchInputChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
      <Box sx={{ p: 3, maxHeight: "300px", overflowY: "auto" }}>
          { 
          
          userType!==Role.TEAM_LEADERS? (filteredCohorts?.map((center) => 
          (
            <Box key={center.id}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <span style={{ color: "black" }}>{center.name}</span>
                <Checkbox
                 checked={center?.name ? checkedCenters.includes(center.name) : false}
                 onChange={() => center?.name && handleToggle(center.name)}
                 
                  sx={{
                    color: theme.palette.text.primary,
                    "&.Mui-checked": {
                      color: "black",
                    },
                    verticalAlign: "middle",
                    marginTop: "-10px",
                  }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Box>
          )
          )):
          (filteredCBlocks?.map((center: any) => (
            <Box key={center.value}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <span style={{ color: "black" }}>{center.label}</span>
                <Checkbox
                  checked={checkedCenters.includes(center.value)}
                  onChange={() => handleToggle2(center.value)}
                  sx={{
                    color: theme.palette.text.primary,
                    "&.Mui-checked": {
                      color: "black",
                    },
                    verticalAlign: "middle",
                    marginTop: "-10px",
                  }}
                />
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Box>
          )))
          }


        </Box>
      
       
      </CustomModal>
    </>
  );
};

export default ReassignCenterModal;
