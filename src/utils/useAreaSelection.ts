import { useState, useEffect } from 'react';
import { getStateList, getDistrictList, getBlockList } from '../services/MasterDataService';

export interface FieldProp {
  value: string;
  label: string;
}

export const useAreaSelection = () => {
  const [states, setStates] = useState<FieldProp[]>([]);
  const [districts, setDistricts] = useState<FieldProp[]>([]);
  const [blocks, setBlocks] = useState<FieldProp[]>([]);
  const [selectedState, setSelectedState] = useState<string[]>([]);
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string[]>([]);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");
  const [selectedBlock, setSelectedBlock] = useState<string[]>([]);
  const [selectedBlockCode, setSelectedBlockCode] = useState<string>("");
  const [dynamicForm, setDynamicForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await getStateList();
        setStates(response?.result || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStates();
  }, []);

  const handleStateChangeWrapper = async (selectedNames: string[], selectedCodes: string[]) => {
    try {
      const response = await getDistrictList(selectedCodes);
      setDistricts(response?.result || []);
    } catch (error) {
      console.log(error);
    }
    handleStateChange(selectedNames, selectedCodes);
  };

  const handleDistrictChangeWrapper = async (selected: string[], selectedCodes: string[]) => {
    if (selected[0] === "") {
      handleBlockChange([], []);
    }
    try {
      const response = await getBlockList(selectedCodes);
      setBlocks(response?.result || []);
    } catch (error) {
      console.log(error);
    }
    handleDistrictChange(selected, selectedCodes);
  };

  const handleStateChange = (selected: string[], code: string[]) => {
    setSelectedDistrict([]);
    setSelectedBlock([]);
    setSelectedState(selected);
    setSelectedStateCode(code.join(","));
  };

  const handleDistrictChange = (selected: string[], code: string[]) => {
    setSelectedBlock([]);
    setSelectedDistrict(selected);
    setSelectedDistrictCode(code.join(","));
  };

  const handleBlockChange = (selected: string[], code: string[]) => {
    setSelectedBlock(selected);
    setSelectedBlockCode(code.join(","));
    setDynamicForm(true);
  };

  return {
    states,
    districts,
    blocks,
    selectedState,
    selectedStateCode,
    selectedDistrict,
    selectedDistrictCode,
    selectedBlock,
    selectedBlockCode,
    dynamicForm,
    handleStateChangeWrapper,
    handleDistrictChangeWrapper,
    handleBlockChange
  };
};
