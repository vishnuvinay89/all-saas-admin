import React, { useState, useEffect } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HeaderComponent from "@/components/HeaderComponent";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import { useTranslation } from "next-i18next";
import {
  getStateList,
  getDistrictList,
  getBlockList,
} from "@/services/MasterDataService";

type StateDetail = {
  value: string;
  label: string;
};

type DistrictDetail = {
  value: string;
  label: string;
};

type BlockDetail = {
  label: string;
};

const Block: React.FC = () => {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>(t("MASTER.SORT"));
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [stateData, setStateData] = useState<StateDetail[]>([]);
  const [districtData, setDistrictData] = useState<DistrictDetail[]>([]);
  const [blockData, setBlockData] = useState<BlockDetail[]>([]);
  const [pageSize, setPageSize] = useState<string | number>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const columns = [
    {
      key: "block",
      title: t("MASTER.BLOCK_NAMES"),
      dataType: DataType.String,
    },
    {
      key: "actions",
      title: t("MASTER.ACTIONS"),
      dataType: DataType.String,
    },
  ];

  const handleChange = (event: SelectChangeEvent<number>) => {
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
    <PageSizeSelector
      handleChange={handleChange}
      pageSize={pageSize}
      options={[5, 10, 15]}
    />
  );

  const handleStateChange = async (event: SelectChangeEvent<string>) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
    try {
      const data = await getDistrictList(selectedState);
      setDistrictData(data.result);
      setSelectedDistrict(data.result[0]?.value || "");
      const blockData = await getBlockList(data.result[0]?.value || "");
      setBlockData(blockData.result);
    } catch (error) {
      console.error("Error fetching district data", error);
    }
  };

  const handleDistrictChange = async (event: SelectChangeEvent<string>) => {
    const selectedDistrict = event.target.value;
    setSelectedDistrict(selectedDistrict);
    try {
      const blockData = await getBlockList(selectedDistrict);
      setBlockData(blockData.result);
    } catch (error) {
      console.error("Error fetching block data", error);
    }
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const sortValue = event.target.value;
    setSelectedSort(sortValue);
    if (sortValue === "Z-A") {
      setSortDirection("desc");
    } else {
      setSortDirection("asc");
    }
    sortBlocks(sortValue);
  };

  const sortBlocks = (sortValue: string) => {
    const sortedBlocks = [...blockData];
    sortedBlocks.sort((a, b) => {
      if (sortDirection === "asc") {
        return a.label.localeCompare(b.label);
      } else {
        return b.label.localeCompare(a.label);
      }
    });
    setBlockData(sortedBlocks);
  };
  const handleFilterChange = async (event: SelectChangeEvent) => {
    console.log(event.target.value as string);
    setSelectedFilter(event.target.value as string);
  };
  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const data = await getStateList();
        setStateData(data.result);
        setSelectedState(data.result[0]?.value || "");
        const districtData = await getDistrictList(data.result[0]?.value || "");
        setDistrictData(districtData.result);
        setSelectedDistrict(districtData.result[0]?.value || "");
        const blockData = await getBlockList(
          districtData.result[0]?.value || ""
        );
        setBlockData(blockData.result);
      } catch (error) {
        console.error("Error fetching initial data", error);
      }
    };
    fetchStateData();
  }, []);

  const userProps = {
    userType: t("MASTER.BLOCKS"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_BLOCK"),
    selectedSort: selectedSort,
    handleStateChange: handleStateChange,
    handleSortChange: handleSortChange,
    handleDistrictChange: handleDistrictChange,
    states: stateData.map((state) => ({
      value: state.value,
      label: state.label,
    })),
    districts: districtData.map((district) => ({
      value: district.value,
      label: district.label,
    })),
    selectedState: selectedState,
    selectedDistrict: selectedDistrict,
    showStateDropdown: false,
    selectedFilter: selectedFilter,
    handleFilterChange: handleFilterChange

  };

  return (
    <React.Fragment>
      <HeaderComponent {...userProps}>
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
                  <MenuItem key={stateDetail.value} value={stateDetail.value}>
                    {stateDetail.label}
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
                {districtData.map((districtDetail) => (
                  <MenuItem
                    key={districtDetail.value}
                    value={districtDetail.value}
                  >
                    {districtDetail.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <KaTableComponent
          columns={columns}
          data={blockData.map((block) => ({
            block: block.label,
            actions: "Action buttons",
          }))}
          limit={pageLimit}
          offset={pageOffset * pageLimit}
          PagesSelector={() => (
            <Pagination
              color="primary"
              count={Math.ceil(blockData.length / pageLimit)}
              page={pageOffset + 1}
              onChange={handlePaginationChange}
            />
          )}
          PageSizeSelector={PageSizeSelectorFunction}
          extraActions={[]}
        />
      </HeaderComponent>
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
