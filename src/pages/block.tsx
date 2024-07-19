import React, { useState, useMemo, useCallback } from "react";
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

// Static Data
const staticStateData = [
  { value: "MH", label: "MAHARASHTRA" },
  { value: "KA", label: "KARNATAKA" },
];

const staticDistrictData = [
  { value: "D1", label: "Pune" },
  { value: "D2", label: "Mumbai" },
];

const staticBlockData = [{ label: "Hinjewadi" }, { label: "Kothrud" }];

const Block: React.FC = () => {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState<string>("MH");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("D1");
  const [selectedSort, setSelectedSort] = useState<string>(t("MASTER.SORT"));
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [stateData] = useState(staticStateData);
  const [districtData] = useState(staticDistrictData);
  const [blockData] = useState(staticBlockData);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const columns = useMemo(
    () => [
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
    ],
    [t]
  );

  const handleChange = useCallback((event: SelectChangeEvent<number>) => {
    setPageSize(Number(event.target.value));
    setPageLimit(Number(event.target.value));
  }, []);

  const handlePaginationChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPageOffset(value - 1);
    },
    []
  );

  const PageSizeSelectorFunction = useCallback(
    () => (
      <PageSizeSelector
        handleChange={handleChange}
        pageSize={pageSize}
        options={[5, 10, 15]}
      />
    ),
    [handleChange, pageSize]
  );

  const handleStateChange = useCallback((event: SelectChangeEvent<string>) => {
    setSelectedState(event.target.value);
  }, []);

  const handleDistrictChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setSelectedDistrict(event.target.value);
    },
    []
  );

  const handleSortChange = useCallback((event: SelectChangeEvent<string>) => {
    const sortValue = event.target.value;
    setSelectedSort(sortValue);
    setSortDirection(sortValue === "Z-A" ? "desc" : "asc");
  }, []);

  const handleFilterChange = useCallback((event: SelectChangeEvent<string>) => {
    setSelectedFilter(event.target.value);
  }, []);

  const handleEdit = useCallback((rowData: any) => {
    console.log("Edit row:", rowData);
  }, []);

  const handleDelete = useCallback((rowData: any) => {
    console.log("Delete row:", rowData);
  }, []);

  const sortedBlocks = [...blockData].sort((a, b) =>
    sortDirection === "asc"
      ? a.label.localeCompare(b.label)
      : b.label.localeCompare(a.label)
  );
  const paginatedData = sortedBlocks.slice(
    pageOffset * pageLimit,
    (pageOffset + 1) * pageLimit
  );

  const userProps = {
    userType: t("MASTER.BLOCKS"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_BLOCK"),
    selectedSort,
    handleStateChange,
    handleSortChange,
    handleDistrictChange,
    states: stateData.map((state) => ({
      value: state.value,
      label: state.label,
    })),
    districts: districtData.map((district) => ({
      value: district.value,
      label: district.label,
    })),
    selectedState,
    selectedDistrict,
    showStateDropdown: false,
    selectedFilter,
    handleFilterChange,
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
          data={paginatedData.map((block) => ({
            block: block.label,
            actions: "Action buttons",
          }))}
          limit={pageLimit}
          offset={pageOffset}
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
          onEdit={handleEdit}
          onDelete={handleDelete}
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
