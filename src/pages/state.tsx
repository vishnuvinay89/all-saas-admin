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
  deleteOption,
  createOrUpdateOption,
} from "@/services/MasterDataService";
import Loader from "@/components/Loader";
import {AddStateModal} from "@/components/AddStateModal";
import { transformLabel } from "@/utils/Helper";
import ConfirmationModal from "@/components/ConfirmationModal";
import { showToastMessage } from "@/components/Toastify";

export interface StateDetail {
  updatedAt: any;
  createdAt: any;
  label: string | undefined;
  name: string;
  value: string;
}

type StateBlockDistrictListParams = {
  controllingfieldfk?: string;
  fieldName: string;
  limit?: number;
  offset?: number;
};

const State: React.FC = () => {
  const { t } = useTranslation();
  const [stateData, setStateData] = useState<StateDetail[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("Sort");
  const [sortBy, setSortBy] = useState<["label", "asc" | "desc"]>([
    "label",
    "asc",
  ]);
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

  const [pageOffset, setPageOffset] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageCount, setPageCount] = useState<number>(0);

  const columns = useMemo(
    () => [
      {
        key: "label",
        title: t("MASTER.STATE_NAMES"),
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

  const handleChange = useCallback((event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setPageLimit(value);
    setPageOffset(0); // Reset to first page
  }, []);

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
        await deleteOption("states", selectedStateForDelete.value);
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
    console.log("state modal clicked")
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
      const response = await createOrUpdateOption(fieldId, newState, stateId);

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
      const data = await getStateBlockDistrictList({
        fieldName: "states",
        limit: pageLimit,
        offset: pageOffset,
      } as StateBlockDistrictListParams);

      console.log("state data", data);
      const sortedData = [...data.result].sort((a, b) => {
        const [field, order] = sortBy;
        return order === "asc"
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      });

      setStateData(sortedData);
      setPageCount(Math.ceil(data.totalCount / pageLimit));
    } catch (error) {
      console.error("Error fetching state data", error);
    } finally {
      setLoading(false);
    }
  }, [sortBy, pageLimit, pageOffset]);

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
      showFilter: false,
      paginationEnable: true,
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
          <div>
            <KaTableComponent
              columns={columns}
              data={stateData.map((stateDetail) => ({
                label: stateDetail.label
                  ? transformLabel(stateDetail.label)
                  : "",
                value: stateDetail.value,
                createdAt: stateDetail.createdAt,
                updatedAt: stateDetail.updatedAt,
              }))}
              limit={pageLimit}
              offset={pageOffset}
              // paginationEnable={true}
              PagesSelector={() => (
                <PageSizeSelector
                  limit={pageLimit}
                  onPageSizeChange={handleChange}
                  pageCount={pageCount}
                  onPageChange={setPageOffset}
                />
              )}
              onEdit={handleEdit}
              onDelete={handleDelete}
              extraActions={[]}
            />{" "}
          </div>
        )}
      </HeaderComponent>
    </div>
  );
};

export const getServerSideProps = async (context: any) => ({
  props: {
    ...(await serverSideTranslations(context.locale, ["common", "master"])),
  },
});

export default State;
