import React, { useState, useEffect, useCallback, useMemo } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType, SortDirection } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HeaderComponent from "@/components/HeaderComponent";
import { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import { useTranslation } from "next-i18next";
import {
  getStateBlockDistrictList,
  deleteState,
  createOrUpdateState,
} from "@/services/MasterDataService";
import Loader from "@/components/Loader";
import AddStateModal from "@/components/AddStateModal";
import { transformLabel } from "@/utils/Helper";
import ConfirmationModal from "@/components/ConfirmationModal";
import { showToastMessage } from "@/components/Toastify";

export interface StateDetail {
  label: string | undefined;
  name: string;
  value: string;
}
const State: React.FC = () => {
  const { t } = useTranslation();
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState<number>(15);
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
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const [selectedStateForDelete, setSelectedStateForDelete] =
    useState<StateDetail | null>(null);
  const [addStateModalOpen, setAddStateModalOpen] = useState<boolean>(false);
  const [selectedStateForEdit, setSelectedStateForEdit] =
    useState<StateDetail | null>(null);
  const [editState, setEditState] = useState<StateDetail | null>(null);

  const columns = useMemo(
    () => [
      {
        key: "label",
        title: t("MASTER.STATE_NAMES"),
        dataType: DataType.String,
        sortDirection: SortDirection.Ascend,
      },
      {
        key: "upadated at",
        title: t("MASTER.UPDATED_AT"),
        dataType: DataType.String,
        sortDirection: SortDirection.Ascend,
      },
      {
        key: "created at",
        title: t("MASTER.CREATED_AT"),
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

  const handleEdit = useCallback((rowData: StateDetail) => {
    setSelectedStateForEdit(rowData);
    setAddStateModalOpen(true); // Open the modal
  }, []);

  const handleDelete = useCallback((rowData: StateDetail) => {
    setSelectedStateForDelete(rowData);
    setConfirmationDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedStateForDelete) {
      try {
        await deleteState(selectedStateForDelete.value);
        setStateData((prevStateData) =>
          prevStateData.filter(
            (state) => state.value !== selectedStateForDelete.value
          )
        );
        showToastMessage(t("COMMON.STATE_DELETED_SUCCESS"), "success");
      } catch (error) {
        console.error("Error deleting state", error);
        showToastMessage(t("COMMON.STATE_DELETED_FAILURE"), "error");
      }
    }
    setConfirmationDialogOpen(false);
  }, [selectedStateForDelete, t]);

  const handleSearch = (keyword: string) => {};

  const fieldId = "61b5909a-0b45-4282-8721-e614fd36d7bd";

  const handleAddStateClick = () => {
    setEditState(null);
    setAddStateModalOpen(true);
  };

  const handleAddStateSubmit = async (
    name: string,
    value: string,
    fieldId: string,
    stateId?: string
  ) => {
    const newState = {
      options: [
        {
          name,
          value,
        },
      ],
    };

    try {
      const response = await createOrUpdateState(fieldId, newState, stateId);

      if (response) {
        await fetchStateData();
        showToastMessage(t("COMMON.STATE_ADDED_SUCCESS"), "success");
      } else {
        console.error("Failed to create/update state:", response);
      }
    } catch (error) {
      console.error("Error creating/updating state:", error);
      showToastMessage(t("COMMON.STATE_ADDED_FAILURE"), "error");
    }
    setAddStateModalOpen(false);
  };

  const fetchStateData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStateBlockDistrictList({ fieldName: "states" });
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
  }, [pageOffset, pageLimit, sortBy]);

  useEffect(() => {
    fetchStateData();
  }, [fetchStateData]);

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
      <AddStateModal
        open={addStateModalOpen}
        onClose={() => setAddStateModalOpen(false)}
        onSubmit={(name, value) =>
          handleAddStateSubmit(
            name,
            value,
            fieldId,
            selectedStateForEdit?.value
          )
        }
        fieldId={fieldId}
        initialValues={
          selectedStateForEdit
            ? {
                name: selectedStateForEdit.label,
                value: selectedStateForEdit.value,
              }
            : {}
        }
        stateId={selectedStateForEdit?.value}
      />
      <ConfirmationModal
        modalOpen={confirmationDialogOpen}
        message={t("COMMON.ARE_YOU_SURE_DELETE")}
        handleAction={handleConfirmDelete}
        buttonNames={{
          primary: t("COMMON.DELETE"),
          secondary: t("COMMON.CANCEL"),
        }}
        handleCloseModal={() => setConfirmationDialogOpen(false)}
      />
      <HeaderComponent
        {...userProps}
        handleSearch={handleSearch}
        handleAddUserClick={handleAddStateClick}
      >
        {loading ? (
          <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />
        ) : (
          <KaTableComponent
            columns={columns}
            data={stateData.map((stateDetail) => ({
              label: stateDetail.label ? transformLabel(stateDetail.label) : "",
              value: stateDetail.value,
            }))}
            limit={pageLimit}
            offset={pageOffset}
            PagesSelector={() => null}
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

export default State;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
