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
};

const District: React.FC = () => {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState(StateData[0]?.state || "");
  const [selectedDistrict, setSelectedDistrict] = useState(
    StateData[0]?.districts[0] || "-"
  );
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedSort, setSelectedSort] = useState(t("MASTER.SORT"));
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [stateData, setStateData] = useState<StateDetails[]>(StateData);
  const [data, setData] = useState<UserDetails[]>([]);
  const [pageSize, setPageSize] = useState<string | number>("");

  const columns = [
    {
      key: "district",
      title: t("MASTER.DISTRICT_NAMES"),
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
      setSelectedDistrict("-");
    }
  };

  const handleDistrictChange = (event: SelectChangeEvent) => {
    const selectedDistrict = event.target.value as string;
    setSelectedDistrict(selectedDistrict);
    fetchDataForDistrict(selectedDistrict);
  };

  const handleBlockChange = (event: SelectChangeEvent) => {
    setSelectedBlock(event.target.value as string);
  };

  const handleSortChange = async (event: SelectChangeEvent) => {
    setSelectedSort(event.target.value as string);
  };

  const fetchDataForDistrict = (district: string) => {
    // Simulate fetching data based on selected district
    const newData: UserDetails[] = []; // Replace with actual data fetching logic
    setData(newData);
  };

  const userProps = {
    userType: t("MASTER.DISTRICTS"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_DISTRICT"),
    selectedSort: selectedSort,
    handleStateChange: handleStateChange,
    handleDistrictChange: handleDistrictChange,
    states: stateData.map((state) => state.state),
    districts:
      stateData.find((state) => state.state === selectedState)?.districts || [],
    selectedState: selectedState,
    selectedDistrict: selectedDistrict,
    showStateDropdown: false,
  };

  return (
    <React.Fragment>
      <UserComponent {...userProps}>
        <Box sx={{ minWidth: 240 }}>
          <FormControl sx={{ minWidth: 240 }}>
            <InputLabel id="demo-simple-select-label">States</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedState}
              label="Age"
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
        <KaTableComponent
          columns={columns}
          data={stateData
            .filter((state) => state.state === selectedState)
            .flatMap((state) =>
              state.districts.map((district) => ({
                district: district,
                actions: "Action buttons",
              }))
            )}
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
          extraActions={[]}
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

export default District;
