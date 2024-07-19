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
import { getDistrictList, getStateList } from "@/services/MasterDataService";

type StateDetail = {
  value: string;
  label: string;
};

type DistrictDetail = {
  label: string;
};

const District: React.FC = () => {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("-");
  const [selectedSort, setSelectedSort] = useState<string>("Sort");
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageSize, setPageSize] = useState<number>(10);
  const [stateData, setStateData] = useState<StateDetail[]>([]);
  const [districtData, setDistrictData] = useState<DistrictDetail[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const columns = [
    {
      key: "label",
      title: t("MASTER.DISTRICT_NAMES"),
      dataType: DataType.String,
    },
    {
      key: "actions",
      title: t("MASTER.ACTIONS"),
      dataType: DataType.String,
    },
  ];

  const handleChange = (event: SelectChangeEvent<number>) => {
    setPageSize(Number(event.target.value));
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
      options={pageSize}
    />
  );

  const handleStateChange = async (event: SelectChangeEvent<string>) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
    try {
      const data = await getDistrictList(selectedState);
      setDistrictData(data.result);
      setSelectedDistrict(data.result[0]?.label || "-");
    } catch (error) {
      console.error("Error fetching district data", error);
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
        if (data.result[0]?.value) {
          const districtData = await getDistrictList(data.result[0].value);
          setDistrictData(districtData.result);
          setSelectedDistrict(districtData.result[0]?.label || "-");
        }
      } catch (error) {
        console.error("Error fetching state data", error);
      }
    };

    fetchStateData();
  }, []);

  useEffect(() => {
    const sortedDistricts = [...districtData].sort((a, b) =>
      sortDirection === "asc"
        ? a.label.localeCompare(b.label)
        : b.label.localeCompare(a.label)
    );
    const paginatedData = sortedDistricts.slice(
      pageOffset * pageLimit,
      (pageOffset + 1) * pageLimit
    );
    setDistrictData(paginatedData);
    setPageCount(Math.ceil(districtData.length / pageLimit));
  }, [pageOffset, pageLimit, sortDirection, districtData]);

  const userProps = {
    userType: t("MASTER.DISTRICTS"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_DISTRICT"),
    selectedSort: selectedSort,
    handleStateChange: handleStateChange,
    handleSortChange: handleSortChange,
    states: stateData.map((state) => state.label),
    districts: districtData.map((district) => district.label),
    selectedState: selectedState,
    selectedDistrict: selectedDistrict,
    showStateDropdown: false,
    selectedFilter:selectedFilter,
    handleFilterChange:handleFilterChange
  };

  return (
    <React.Fragment>
      <HeaderComponent {...userProps}>
        <Box sx={{ minWidth: 240 }}>
          <FormControl sx={{ minWidth: 240 }}>
            <InputLabel id="demo-simple-select-label">States</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedState}
              label="State"
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
        <KaTableComponent
          columns={columns}
          data={districtData.map((districtDetail) => ({
            label: districtDetail.label,
            actions: "Action buttons",
          }))}
          limit={pageLimit}
          offset={pageOffset}
          PagesSelector={() => (
            <Pagination
              color="primary"
              count={pageCount}
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

export default District;
