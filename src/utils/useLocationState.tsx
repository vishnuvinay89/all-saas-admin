import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@mui/material";
import {
  getStateBlockDistrictList,
  getCenterList,
} from "../services/MasterDataService"; // Update the import path as needed
import { getCohortList } from "@/services/CohortService/cohortService";
import { FormContextType } from "./app.constant";
import { useTranslation } from "react-i18next";
interface FieldProp {
  value: string;
  label: string;
}
interface CenterProp {
  cohortId: string;
  name: string;
}
export const useLocationState = (
  open: boolean,
  onClose: () => void,
  userType?: any
) => {
  const [states, setStates] = useState<FieldProp[]>([]);
  const [districts, setDistricts] = useState<FieldProp[]>([]);
  const [blocks, setBlocks] = useState<FieldProp[]>([]);
  const [allCenters, setAllCenters] = useState<CenterProp[]>([]);
  const isMobile = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:986px)");
  const [selectedState, setSelectedState] = useState<string[]>([]);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string[]>([]);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedCenter, setSelectedCenter] = useState<string[]>([]);
  const [dynamicForm, setDynamicForm] = useState<any>(false);
  const [dynamicFormForBlock, setdynamicFormForBlock] = useState<any>(false);

  const [selectedBlock, setSelectedBlock] = useState<string[]>([]);
  const [selectedBlockCode, setSelectedBlockCode] = useState("");
  const [selectedCenterCode, setSelectedCenterCode] = useState("");
  const [selectedBlockCohortId, setSelectedBlockCohortId] = useState("");
  const [blockFieldId, setBlockFieldId] = useState("");
  const [stateFieldId, setStateFieldId] = useState("");
  const [districtFieldId, setDistrictFieldId] = useState("");
  const [stateDefaultValue, setStateDefaultValue] = useState<string>("");
  const { t } = useTranslation();
  const handleStateChangeWrapper = useCallback(
    async (selectedNames: string[], selectedCodes: string[]) => {
      console.log("true", selectedCodes)
      try {
        setDistricts([]);
        setBlocks([]);
        setAllCenters([]);
        setSelectedStateCode(selectedCodes[0]);
        setSelectedBlockCohortId("");

        const object = {
          controllingfieldfk: selectedCodes[0],
          fieldName: "districts",
        };
        const response = await getStateBlockDistrictList(object);
        setDistrictFieldId(response?.result?.fieldId);
        const result = response?.result?.values;
        setDistricts(result);
      } catch (error) {
        console.log(error);
      }
      handleStateChange(selectedNames, selectedCodes);
    },
    [selectedStateCode]
  );

  const handleDistrictChangeWrapper = useCallback(
    async (selected: string[], selectedCodes: string[]) => {
      if (selected[0] === "") {
        handleBlockChange([], []);
      }
      try {
        setBlocks([]);
        setAllCenters([]);
        setSelectedDistrictCode(selectedCodes[0]);
        setSelectedBlockCohortId("");
        const object = {
          controllingfieldfk: selectedCodes[0],
          fieldName: "blocks",
        };
        const response = await getStateBlockDistrictList(object);
        setBlockFieldId(response?.result?.fieldId);
           //console.log(blockFieldId)
        const result = response?.result?.values;
        setBlocks(result);
      } catch (error) {
        console.log(error);
      }
      handleDistrictChange(selected, selectedCodes);
    },
    [selectedDistrictCode]
  );

  const handleBlockChangeWrapper = useCallback(
    async (selected: string[], selectedCodes: string[]) => {
      if (selected[0] === "") {
        handleCenterChange([], []);
      }
      try {
        setAllCenters([]);

        console.log(selectedStateCode, selectedDistrictCode);
        console.log(userType);
        if (userType === FormContextType.TEAM_LEADER  ||
          userType === FormContextType.ADMIN_CENTER) {
          console.log("true");
          const object = {
            limit: 200,
            offset: 0,
            filters: {
              // "type": "COHORT",
              status: ["active"],
              // "states": selectedStateCode,
              // "districts": selectedDistrictCode,
              // "blocks": selectedCodes[0]
              name: selected[0],
            },
          };
          const response = await getCenterList(object);
          setSelectedBlockCohortId(
            response?.result?.results?.cohortDetails[0].cohortId
          );
          console.log(
            "response?.result?.results?.cohortDetails[0].cohortId",
            response?.result?.results?.cohortDetails[0].cohortId
          );
        } else {
          const getCentersObject = {
            limit: 200,
            offset: 0,
            filters: {
              // "type":"COHORT",
              status: ["active"],
              states: selectedStateCode,
              districts: selectedDistrictCode,
              blocks: selectedCodes[0],
              // "name": selected[0]
            },
          };
          const response = await getCenterList(getCentersObject);
          console.log(response?.result?.results?.cohortDetails[0].cohortId);
          setSelectedBlockCohortId(
            response?.result?.results?.cohortDetails[0].cohortId
          );
          //   const result = response?.result?.cohortDetails;
          const dataArray = response?.result?.results?.cohortDetails;

          const cohortInfo = dataArray
            ?.filter((cohort: any) => cohort.type !== "BLOCK")
            .map((item: any) => ({
              cohortId: item?.cohortId,
              name: item?.name,
            }));
          console.log(dataArray);
          setAllCenters(cohortInfo);
        }
        console.log(selected);
      } catch (error) {
        setAllCenters([]);

        console.log(error);
      }
      handleBlockChange(selected, selectedCodes);
    },
    [selectedBlockCode, selectedDistrictCode, selectedStateCode]
  );

  const handleCenterChangeWrapper = useCallback(
    (selected: string[], selectedCodes: string[]) => {
      handleCenterChange(selected, selectedCodes);
    },
    []
  );

  const handleStateChange = useCallback(
    (selected: string[], code: string[]) => {
      setSelectedDistrict([]);
      setSelectedBlock([]);
      setSelectedCenter([]);
      setSelectedState(selected);
      const stateCodes = code?.join(",");
      setSelectedStateCode(stateCodes);
      console.log("Selected categories:", typeof code[0]);
    },
    []
  );

  const handleDistrictChange = useCallback(
    (selected: string[], code: string[]) => {
      setSelectedBlock([]);
      setSelectedCenter([]);
      setSelectedDistrict(selected);
      const districts = code?.join(",");
      setSelectedDistrictCode(districts);
      console.log("Selected categories:", districts);
    },
    []
  );

  const handleBlockChange = useCallback(
    (selected: string[], code: string[]) => {
      setSelectedCenter([]);
      setSelectedBlock(selected);
      const blocks = code?.join(",");
      setSelectedBlockCode(blocks);
      setdynamicFormForBlock(true);
      console.log("Selected categories:", blocks);
    },
    []
  );

  const handleCenterChange = useCallback(
    (selected: string[], code: string[]) => {
      // handle center change logic
      setSelectedCenter(selected);
      const centers = code?.join(",");
      setSelectedCenterCode(centers);
      setDynamicForm(true);

      console.log("Selected categories:", selected);
    },
    []
  );

  useEffect(() => {
    if (!open) {
      setSelectedBlock([]);
      setSelectedDistrict([]);
      setSelectedState([]);
      setSelectedCenter([]);
      setDynamicForm(false);
      setdynamicFormForBlock(false);
    }
  }, [onClose, open]);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const object = {
          fieldName: "states",
        };
        const response = await getStateBlockDistrictList(object);
        setStateFieldId(response?.result?.fieldId);
      

 
        if (typeof window !== "undefined" && window.localStorage) {
          const admin = localStorage.getItem("adminInfo");
          if(admin)
          {

            const stateField = JSON.parse(admin).customFields.find((field: any) => field.label === "STATES");
              console.log(stateField.value, stateField.code)
             if (!stateField.value.includes(',')) {
              const object2 = {
                controllingfieldfk: stateField.code,
                fieldName: "districts",
              };
              const response2 = await getStateBlockDistrictList(object2);
              setDistrictFieldId(response2?.result?.fieldId);
              //setStateDefaultValue(t("COMMON.ALL_STATES"))

                setStateDefaultValue(stateField.value);

                setSelectedState([stateField.value]);
                setSelectedStateCode(stateField.code)
                const object = {
                  controllingfieldfk: stateField.code,
          
                  fieldName: "districts",
                };
                console.log(object);
                const response = await getStateBlockDistrictList(object);
                const result = response?.result?.values;
                console.log(result)
                setDistricts(result);

              }
              else{
                setStateDefaultValue(t("COMMON.ALL_STATES"))

              }
              const object2=[{
                value:stateField.code,
                label:stateField.value
              }]
             setStates(object2);

          }
          //console.log(JSON.parse(admin)?.customFields)
       //  setAdminInfo(JSON.parse(admin))
        }
       // const result = response?.result?.values;
        //console.log(result)
       // setStates(result);
        console.log(typeof states);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  console.log(stateDefaultValue)
  return {
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
    dynamicFormForBlock,
    blockFieldId,
    districtFieldId,
    stateFieldId,
    handleStateChangeWrapper,
    handleDistrictChangeWrapper,
    handleBlockChangeWrapper,
    handleCenterChangeWrapper,
    selectedCenterCode,
    selectedBlockCohortId,
    stateDefaultValue
  };
};
