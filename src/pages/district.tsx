import React, { useState, useEffect, useMemo, useCallback } from "react";
import KaTableComponent from "../components/KaTableComponent";
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
import CustomModal from "@/components/CustomModal";
import { SortDirection, DataType } from "ka-table/enums";
import {
  getStateBlockDistrictList,
  getDistrictsForState,
} from "@/services/MasterDataService";
import { transformLabel } from "@/utils/Helper";

type StateDetail = {
  value: string;
  label: string;
};

type DistrictDetail = {
  updatedAt: any;
  createdAt: any;
  value: string;
  label: string;
};

const District: React.FC = () => {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState<string>("");
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
  const [confirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);
  const [selectedDistrictForDelete, setSelectedDistrictForDelete] =
    useState<DistrictDetail | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const columns = useMemo(
    () => [
      {
        key: "label",
        title: t("MASTER.DISTRICT_NAMES"),
        dataType: DataType.String,
        sortDirection: SortDirection.Ascend,
      },
      {
        key: "createdAt",
        title: t("MASTER.CREATED_AT"),
        dataType: DataType.String,
        sortDirection: SortDirection.Ascend,
      },
      {
        key: "updatedAt",
        title: t("MASTER.UPDATED_AT"),
        dataType: DataType.String,
        sortDirection: SortDirection.Ascend,
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
        const data = await getDistrictsForState({
          controllingfieldfk: selectedState,
          fieldName: "districts",
        });
        setDistrictData(data.result || []);
        setSelectedDistrict("-");
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

  const handleDelete = useCallback((rowData: DistrictDetail) => {
    setSelectedDistrictForDelete(rowData);
    setConfirmationModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    console.log("Delete row:", selectedDistrictForDelete);
    setConfirmationModalOpen(false);
  }, [selectedDistrictForDelete]);

  const handleFilterChange = useCallback((event: SelectChangeEvent<string>) => {
    console.log(event.target.value);
    setSelectedFilter(event.target.value);
  }, []);

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const data = await getStateBlockDistrictList({ fieldName: "states" });
        if (data?.result) {
          setStateData(data.result);
          const initialSelectedState = data.result[0]?.value || "";
          setSelectedState(initialSelectedState);

          const initialDistrictData = await getDistrictsForState({
            controllingfieldfk: initialSelectedState,
            fieldName: "districts",
          });
          if (initialDistrictData?.result) {
            setDistrictData(initialDistrictData.result);
          } else {
            console.error(
              "No initial district data returned:",
              initialDistrictData
            );
            setDistrictData([]);
          }
        } else {
          console.error("No state data returned:", data);
          setStateData([]);
        }
      } catch (error) {
        console.error("Error fetching state data", error);
        setStateData([]);
      }
    };

    fetchStateData();
  }, []);

  useEffect(() => {
    const sortAndPaginateData = () => {
      if (districtData.length === 0) {
        setSortedDistricts([]);
        setPageCount(1);
        return;
      }
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
      setPageCount(Math.ceil(sorted.length / pageLimit));
    };

    sortAndPaginateData();
  }, [districtData, pageOffset, pageLimit, sortDirection]);

  const userProps = {
    userType: t("MASTER.DISTRICTS"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_DISTRICT"),
    selectedSort,
    handleStateChange,
    handleSortChange,
    states: stateData.map((state) => state.value) || [],
    districts: districtData.map((district) => district.label) || [],
    selectedState,
    showStateDropdown: false,
    selectedFilter,
    handleFilterChange,
    handleSearch: () => {},
    showFilter: false,
  };

  const showPagination = sortedDistricts.length > 10;

  return (
    <React.Fragment>
      <CustomModal
        open={confirmationModalOpen}
        handleClose={() => setConfirmationModalOpen(false)}
        title={t("COMMON.CONFIRM_DELETE")}
        primaryBtnText={t("COMMON.DELETE")}
        secondaryBtnText={t("COMMON.CANCEL")}
        primaryBtnClick={handleConfirmDelete}
      >
        <Box>{t("COMMON.ARE_YOU_SURE_DELETE")}</Box>
      </CustomModal>
      <HeaderComponent {...userProps}>
        <Box display="flex" gap={2}>
          <FormControl variant="outlined" sx={{ minWidth: 220, marginTop: 2 }}>
            <InputLabel id="state-select-label">{t("MASTER.STATE")}</InputLabel>
            <Select
              labelId="state-select-label"
              id="state-select"
              value={selectedState}
              onChange={handleStateChange}
              label={t("MASTER.STATE")}
            >
              {stateData.map((state) => (
                <MenuItem key={state.value} value={state.value}>
                  {transformLabel(state.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <KaTableComponent
          columns={columns}
          data={sortedDistricts.map((districtDetail) => ({
            label: transformLabel(districtDetail.label),
            createdAt: districtDetail.createdAt,
            updatedAt:districtDetail.updatedAt
          }))}
          limit={pageLimit}
          offset={pageOffset}
          PagesSelector={() =>
            showPagination && (
              <Pagination
                color="primary"
                count={pageCount}
                page={pageOffset + 1}
                onChange={handlePaginationChange}
              />
            )
          }
          PageSizeSelector={PageSizeSelectorFunction}
          extraActions={[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          noData={districtData.length === 0}
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
