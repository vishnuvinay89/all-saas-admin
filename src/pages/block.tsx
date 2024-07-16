import React, { useState, useEffect } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import UserComponent from "@/components/UserComponent";
import StateData from "./dummyAPI/stateData"; 
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import { useTranslation } from "next-i18next";

type UserDetails = {
  userId: any;
  username: any;
  name: any;
  role: any;
  mobile: any;
  centers?: any;
  Programs?: any;
};

type StateDetails = {
  state: string;
  districts: string[];
  blocks: string[];
};

const Block: React.FC = () => {
  const [selectedState, setSelectedState] = useState("All states");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedBlock, setSelectedBlock] = useState("All Blocks");
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [stateData, setStateData] = useState<StateDetails[]>(StateData);
  const [data, setData] = useState<UserDetails[]>([]);
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState<string | number>("");

  const columns = [
    {
      key: "blocks",
      title: t("MASTER.BLOCK_NAMES"),
      dataType: DataType.String,
    },
    {
      key: "actions",
      title: t("MASTER.ACTIONS"),
      dataType: DataType.String,
    },
  ];

  const handleChange = (event: SelectChangeEvent<typeof pageSize>) => {
    setPageSize(event.target.value);
    setPageLimit(Number(event.target.value));
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageOffset(value - 1);
  };

  const PageSizeSelectorFunction = () => (
    <PageSizeSelector handleChange={handleChange} pageSize={pageSize} />
  );

  const handleStateChange = (event: SelectChangeEvent) => {
    const selectedState = event.target.value as string;
    setSelectedState(selectedState);
    const state = stateData.find((state) => state.state === selectedState);
    if (state) {
      setSelectedDistrict(state.districts[0]);
      fetchDataForDistrict(state.districts[0]);
    } else {
      setSelectedDistrict("All Districts");
    }
  };

  const handleDistrictChange = (event: SelectChangeEvent) => {
    const selectedDistrict = event.target.value as string;
    setSelectedDistrict(selectedDistrict);
    setSelectedBlock("All Blocks"); 
    fetchDataForDistrict(selectedDistrict);
  };

  const handleBlockChange = (event: SelectChangeEvent) => {
    setSelectedBlock(event.target.value as string);
  };

  const handleSortChange = async (event: SelectChangeEvent) => {
    setSelectedSort(event.target.value as string);
  };

  const fetchDataForDistrict = (district: string) => {
    const newData: UserDetails[] = [];
    setData(newData);
  };

  const userProps = {
    userType: t("MASTER.BLOCKS"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_BLOCK"),
    selectedSort: selectedSort,
    handleStateChange: handleStateChange,
    handleDistrictChange: handleDistrictChange,
    states: stateData.map((state) => state.state),
    districts:
      stateData.find((state) => state.state === selectedState)?.districts || [],
    blocks:
      stateData.find((state) => state.state === selectedState)?.blocks || [],
    selectedState: selectedState,
    selectedDistrict: selectedDistrict,
    showStateDropdown: false,
  };

  return (
    <React.Fragment>
      <UserComponent {...userProps}>
        <Box sx={{ minWidth: 240, display: "flex", gap: 5 }}>
          <Box sx={{ minWidth: 240 }}>
            <FormControl sx={{ minWidth: 240 }}>
              <InputLabel id="state-select-label">States</InputLabel>
              <Select
                labelId="state-select-label"
                id="state-select"
                value={selectedState}
                onChange={handleStateChange}
              >
                {stateData.map((stateDetail) => (
                  <MenuItem key={stateDetail.state} value={stateDetail.state}>
                    {stateDetail.state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 240 }}>
            <FormControl sx={{ minWidth: 240 }}>
              <InputLabel id="district-select-label">Districts</InputLabel>
              <Select
                labelId="district-select-label"
                id="district-select"
                value={selectedDistrict}
                onChange={handleDistrictChange}
              >
                {stateData
                  .find((state) => state.state === selectedState)
                  ?.districts.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <KaTableComponent
          columns={columns}
          data={
            selectedDistrict !== "All Districts"
              ? stateData
                  .find((state) => state.state === selectedState)
                  ?.blocks.map((block) => ({
                    blocks: block,
                    actions: "Action buttons",
                  })) || []
              : []
          }
          limit={pageLimit}
          offset={pageOffset * pageLimit}
          PagesSelector={() => (
            <Pagination
              color="primary"
              count={Math.ceil(data.length / pageLimit)}
              page={pageOffset + 1}
              onChange={handlePaginationChange}
            />
          )}
          PageSizeSelector={PageSizeSelectorFunction}
        />
      </UserComponent>
    </React.Fragment>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Block;
