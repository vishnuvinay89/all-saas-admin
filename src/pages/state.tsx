import React, { useState, useEffect, useCallback, useMemo } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HeaderComponent from "@/components/HeaderComponent";
import Pagination from "@mui/material/Pagination";
import { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import { useTranslation } from "next-i18next";
import { getStateList } from "@/services/MasterDataService";
import { SortDirection } from "ka-table/enums";
import Loader from "@/components/Loader";
import Image from "next/image";
import glass from "../../public/images/empty_hourglass.svg";
import { Box, Typography } from "@mui/material";
import DeleteUserModal from "@/components/DeleteUserModal"; // Import your DeleteUserModal component

type StateDetail = {
  label: string;
};

const State: React.FC = () => {
  const { t } = useTranslation();

  // State management
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [stateData, setStateData] = useState<StateDetail[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("Sort");
  const [sortBy, setSortBy] = useState<["label", "asc" | "desc"]>(["label", "asc"]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<StateDetail | null>(null);
  const [confirmButtonDisable, setConfirmButtonDisable] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");

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
    setSelectedFilter(event.target.value as string);
  }, []);

  const handleEdit = useCallback((rowData: any) => {
    console.log("Edit row:", rowData);
  }, []);

  const handleDelete = useCallback((rowData: any) => {
    setSelectedState(rowData); // Set the selected state to be deleted
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  }, []);

  const handleDeleteUser = useCallback(() => {
    if (selectedState) {
      // Add your delete logic here
      console.log("Deleting user:", selectedState);

      // Close the modal after deletion
      setIsDeleteModalOpen(false);
    }
  }, [selectedState]);

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedState(null);
  };

  const handleSearch = (keyword: string) => {};

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        setLoading(true);
        const data = await getStateList();
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

  return (
    <div>
      <HeaderComponent {...userProps} handleSearch={handleSearch}>
        {loading ? (
          <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />
        ) : stateData.length !== 0 ? (
          <KaTableComponent
            columns={columns}
            data={stateData.map((stateDetail) => ({
              label:
                stateDetail.label?.toLocaleLowerCase().charAt(0).toUpperCase() +
                stateDetail.label?.toLocaleLowerCase().slice(1),
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
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Image src={glass} alt="" />
            <Typography marginTop="10px">
              {t("COMMON.NO_DATA_FOUND")}
            </Typography>
          </Box>
        )}
      </HeaderComponent>

      {/* DeleteUserModal Component */}
      <DeleteUserModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        selectedValue={selectedReason}
        setSelectedValue={setSelectedReason}
        handleDeleteAction={handleDeleteUser}
        otherReason={otherReason}
        setOtherReason={setOtherReason}
        confirmButtonDisable={confirmButtonDisable}
        setConfirmButtonDisable={setConfirmButtonDisable}
      />
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
