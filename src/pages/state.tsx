import React, { useState, useEffect, useCallback, useMemo } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HeaderComponent from "@/components/HeaderComponent";
import Pagination from "@mui/material/Pagination";
import { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import { useTranslation } from "next-i18next";
import { getStateBlockDistrictList } from "@/services/MasterDataService";
import { SortDirection } from "ka-table/enums";
import Loader from "@/components/Loader";
import { Box } from "@mui/material";
import CustomModal from "@/components/CustomModal";
import { transformLabel } from "@/utils/Helper";

type StateDetail = {
  label: string;
};

const State: React.FC = () => {
  const { t } = useTranslation();
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [stateData, setStateData] = useState<StateDetail[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("Sort");
  const [sortBy, setSortBy] = useState<["label", "asc" | "desc"]>([
    "label",
    "asc",
  ]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<StateDetail | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);
  const [selectedDistrictForDelete, setSelectedDistrictForDelete] =
    useState<StateDetail | null>(null);

  const columns = useMemo(
    () => [
      {
        key: "label",
        title: t("MASTER.STATE_NAMES"),
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

  const handleChange = useCallback((event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setPageSize(value);
    setPageLimit(value);
  }, []);

  const handlePaginationChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPageOffset(value - 1);
    },
    []
  );

  const handleSortChange = useCallback((event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setSelectedSort(selectedValue);
    setSortBy(["label", selectedValue === "Z-A" ? "desc" : "asc"]);
  }, []);

  const handleFilterChange = useCallback((event: SelectChangeEvent<string>) => {
    setSelectedFilter(event.target.value);
  }, []);

  const handleEdit = useCallback((rowData: any) => {}, []);

  const handleDelete = useCallback((rowData: StateDetail) => {
    setSelectedDistrictForDelete(rowData);
    setConfirmationModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    setConfirmationModalOpen(false);
  }, [selectedDistrictForDelete]);

  const handleSearch = (keyword: string) => {};

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        setLoading(true);
        const object = {
          controllingfieldfk: selectedState,

          fieldName: "districts",
        };
        const data = await getStateBlockDistrictList(object);
        const sortedData = [...data.result].sort((a, b) => {
          const [field, order] = sortBy;
          return order === "asc"
            ? a[field].localeCompare(b[field])
            : b[field].localeCompare(a[field]);
        });

        const offset = pageOffset * pageLimit;
        const paginatedData = sortedData.slice(offset, offset + pageLimit);

        setPageCount(Math.ceil(data.result.length / pageLimit));
        setStateData(paginatedData);
      } catch (error) {
        console.error("Error fetching state data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStateData();
  }, [pageOffset, pageLimit, sortBy]);

  const userProps = useMemo(
    () => ({
      userType: t("MASTER.STATE"),
      searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_STATE"),
      selectedSort,
      handleStateChange: handleChange,
      handleSortChange: handleSortChange,
      states: stateData.map((stateDetail) => stateDetail.label),
      showStateDropdown: false,
      showAddNew: true,
      showSort: true,
      selectedFilter,
      handleFilterChange: handleFilterChange,
    }),
    [
      t,
      selectedSort,
      handleChange,
      handleSortChange,
      stateData,
      selectedFilter,
      handleFilterChange,
    ]
  );

  const showPagination = stateData.length > 10;

  return (
    <div>
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

      <HeaderComponent {...userProps} handleSearch={handleSearch}>
        {loading ? (
          <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />
        ) : (
          <KaTableComponent
            columns={columns}
            data={stateData.map((stateDetail) => ({
              label: transformLabel(stateDetail.label),
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
            PageSizeSelector={() => (
              <PageSizeSelector
                handleChange={handleChange}
                pageSize={pageSize}
                options={[5, 10, 15]}
              />
            )}
            extraActions={[]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </HeaderComponent>
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default State;
