import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@mui/material";
import {
  getStateBlockDistrictList,
  getCenterList,
} from "../services/MasterDataService"; // Update the import path as needed
import { getCohortList } from "@/services/CohortService/cohortService";
interface FieldProp {
  value: string;
  label: string;
}
interface CenterProp {
  cohortId: string;
  name: string;
}

export const useLocationState = (open: boolean, onClose: () => void) => {
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
  const [selectedBlockFieldId, setSelectedBlockFieldId] = useState("");
  const [BlockFieldId, setBlockFieldId] = useState("");
  const [StateFieldId, setStateFieldId] = useState("");
  const [DistrctFieldId, setDistrictFieldId] = useState("");

  const handleStateChangeWrapper = useCallback(
    async (selectedNames: string[], selectedCodes: string[]) => {
      try {
        setSelectedStateCode(selectedCodes[0]);

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
        setSelectedDistrictCode(selectedCodes[0]);
        const object = {
          controllingfieldfk: selectedCodes[0],
          fieldName: "blocks",
        };
        const response = await getStateBlockDistrictList(object);
        setBlockFieldId(response?.result?.fieldId);

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
        console.log(selectedStateCode, selectedDistrictCode);
        const object = {
            "limit":200,
            "offset": 0,
            "filters": {
                // "type": "COHORT",
                "status": [
                    "active"
                ],
                // "states": selectedStateCode,
                // "districts": selectedDistrictCode,
                // "blocks": selectedCodes[0]
                name:selected[0]
            }
        };
        const response2 = await getCenterList(object);

        console.log(selected)
        const getBlockIdObject={
          "limit": 200,
          "offset": 0,          "filters": {
            // "type":"COHORT",
            "status": [
                "active"
            ],
            "states": selectedStateCode,
                "districts": selectedDistrictCode,
                "blocks": selectedCodes[0]
           // "name": selected[0]
        },
        }
        const response = await getCenterList(getBlockIdObject);
        setSelectedBlockFieldId(
          response?.result?.results?.cohortDetails[0].cohortId
        );
        console.log(response?.result?.results?.cohortDetails[0].cohortId);
        //   const result = response?.result?.cohortDetails;
        const dataArray = response?.result?.results?.cohortDetails;

        const cohortInfo = dataArray?.map((item: any) => ({
          cohortId: item?.cohortId,
          name: item?.name,
        }));
        console.log(dataArray);
        setAllCenters(cohortInfo);
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
        const result = response?.result?.values;
        setStates(result);
        console.log(typeof states);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

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
    BlockFieldId,
    DistrctFieldId,
    StateFieldId,
    handleStateChangeWrapper,
    handleDistrictChangeWrapper,
    handleBlockChangeWrapper,
    handleCenterChangeWrapper,
    selectedCenterCode,
    selectedBlockFieldId,
  };
};
