import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { SortDirection  } from 'ka-table/enums';

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
  const [sortedDistricts, setSortedDistricts] = useState<DistrictDetail[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const columns = useMemo(
    () => [
      {
        key: "label",
        title: t("MASTER.DISTRICT_NAMES"),
        dataType: DataType.String,
        sortDirection: SortDirection.Ascend

      },
      {
        key: "actions",
        title: t("MASTER.ACTIONS"),
        dataType: DataType.String,

      },
    ],
    [t]
  );

  const handleChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setPageSize(value);
    setPageLimit(value);
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageOffset(value - 1);
  };

  const PageSizeSelectorFunction = useCallback(
    () => (
      <PageSizeSelector
        handleChange={handleChange}
        pageSize={pageSize}
        options={[5, 10, 15]}
      />
    ),
    [pageSize]
  );

  const handleStateChange = useCallback(
    async (event: SelectChangeEvent<string>) => {
      const selectedState = event.target.value;
      setSelectedState(selectedState);
      try {
        const data = await getDistrictList(selectedState);
        setDistrictData(data.result || []);
        setSelectedDistrict(data.result[0]?.label || "-");
      } catch (error) {
        console.error("Error fetching district data", error);
      }
    },
    []
  );

  const handleSortChange = useCallback((event: SelectChangeEvent<string>) => {
    const sortValue = event.target.value;
    setSelectedSort(sortValue);
    setSortDirection(sortValue === "Z-A" ? "desc" : "asc");
  }, []);

  const handleEdit = useCallback((rowData: any) => {
    console.log("Edit row:", rowData);
  }, []);

  const handleDelete = useCallback((rowData: any) => {
    console.log("Delete row:", rowData);
  }, []);

  const handleFilterChange = useCallback(
    async (event: SelectChangeEvent<string>) => {
      console.log(event.target.value);
      setSelectedFilter(event.target.value);
    },
    []
  );

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const data = await getStateList();
        setStateData(data.result || []);
        const initialSelectedState = data.result[0]?.value || "";
        setSelectedState(initialSelectedState);
        const districtData = await getDistrictList(initialSelectedState);
        setDistrictData(districtData.result || []);
        setSelectedDistrict(districtData.result[0]?.label || "-");
      } catch (error) {
        console.error("Error fetching state data", error);
      }
    };

    fetchStateData();
  }, []);

  useEffect(() => {
    const sortAndPaginateData = () => {
      const sorted = [...districtData].sort((a, b) =>
        sortDirection === "asc"
          ? a.label.localeCompare(b.label)
          : b.label.localeCompare(a.label)
      );
      const paginatedData = sorted.slice(
        pageOffset * pageLimit,
        (pageOffset + 1) * pageLimit
      );
      setSortedDistricts(paginatedData);
      setPageCount(Math.ceil(districtData.length / pageLimit));
    };

    sortAndPaginateData();
  }, [districtData, pageOffset, pageLimit, sortDirection]);

  const userProps = {
    userType: t("MASTER.DISTRICTS"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_DISTRICT"),
    selectedSort,
    handleStateChange,
    handleSortChange,
    states: stateData.map((state) => state.label) || [],
    districts: districtData.map((district) => district.label) || [],
    selectedState,
    selectedDistrict,
    showStateDropdown: false,
    selectedFilter,
    handleFilterChange,
  };

  return (
    <React.Fragment>
      <HeaderComponent {...userProps}>
        <Box
          sx={{
            minWidth: 240,
            marginTop: 2,
            "@media (max-width: 580px)": {
              marginTop: 3,
              marginBottom: 3,
              flexDirection: "column",
              alignItems: "center",
            },
          }}
        >
          <FormControl sx={{ minWidth: 340 }}>
            <InputLabel id="state-select-label">States</InputLabel>
            <Select
              labelId="state-select-label"
              id="state-select"
              value={selectedState}
              label="State"
              onChange={handleStateChange}
            >
              {stateData.map((stateDetail) => (
                <MenuItem key={stateDetail.value} value={stateDetail.value}>
                  {stateDetail.label
                    ?.toLocaleLowerCase()
                    .charAt(0)
                    .toUpperCase() +
                    stateDetail.label?.toLocaleLowerCase().slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <KaTableComponent
          columns={columns}
          data={sortedDistricts.map((districtDetail) => ({
            label:
              districtDetail.label
                ?.toLocaleLowerCase()
                .charAt(0)
                .toUpperCase() +
              districtDetail.label?.toLocaleLowerCase().slice(1),
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

export default District;
