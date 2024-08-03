import React, { useState, useEffect } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HeaderComponent from "@/components/HeaderComponent";
import { useTranslation } from "next-i18next";
import {
  getStateBlockDistrictList,
  deleteOption,
  createOrUpdateOption,
} from "@/services/MasterDataService";
import Loader from "@/components/Loader";
import { AddStateModal } from "@/components/AddStateModal";
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
  optionName?: string;
};

const State: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSort, setSelectedSort] = useState<string>("Sort");
  const [stateData, setStateData] = useState<StateDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const [selectedStateForDelete, setSelectedStateForDelete] =
    useState<StateDetail | null>(null);
  const [addStateModalOpen, setAddStateModalOpen] = useState<boolean>(false);
  const [selectedStateForEdit, setSelectedStateForEdit] =
    useState<StateDetail | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [fieldId, setFieldId] = useState<string>("");

  const columns = [
    {
      key: "label",
      title: t("MASTER.STATE_NAMES"),
    },
    {
      key: "value",
      title: t("MASTER.STATE_CODE"),
    },
    {
      key: "createdAt",
      title: t("MASTER.CREATED_AT"),
    },
    {
      key: "updatedAt",
      title: t("MASTER.UPDATED_AT"),
    },
    {
      key: "actions",
      title: t("MASTER.ACTIONS"),
    },
  ];

  const handleEdit = (rowData: StateDetail) => {
    setSelectedStateForEdit(rowData);
    setAddStateModalOpen(true);
  };

  const handleDelete = (rowData: StateDetail) => {
    setSelectedStateForDelete(rowData);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedStateForDelete) {
      try {
        await deleteOption("states", selectedStateForDelete.value);
        setStateData((prevStateData) =>
          prevStateData.filter(
            (state) => state.value !== selectedStateForDelete.value,
          ),
        );
        showToastMessage(t("COMMON.STATE_DELETED_SUCCESS"), "success");
      } catch (error) {
        console.error("Error deleting state", error);
        showToastMessage(t("COMMON.STATE_DELETED_FAILURE"), "error");
      }
    }
    setConfirmationDialogOpen(false);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    fetchStateData(keyword);
  };

  const handleAddStateClick = () => {
    setSelectedStateForEdit(null);
    setAddStateModalOpen(true);
  };

  const handleAddStateSubmit = async (
    name: string,
    value: string,
    stateId?: string,
  ) => {
    const newState = {
      options: [{ name, value }],
    };

    try {
      if (fieldId) {
        const response = await createOrUpdateOption(fieldId, newState, stateId);
        if (response) {
          await fetchStateData(searchKeyword);
          showToastMessage(t("COMMON.STATE_ADDED_SUCCESS"), "success");
        } else {
          console.error("Failed to create/update state:", response);
        }
      }
    } catch (error) {
      console.error("Error creating/updating state:", error);
      showToastMessage(t("COMMON.STATE_ADDED_FAILURE"), "error");
    }
    setAddStateModalOpen(false);
  };
  const fetchStateData = async (keyword?: string) => {
    try {
      setLoading(true);
      const data = await getStateBlockDistrictList({
        fieldName: "states",
        optionName: keyword,
      } as StateBlockDistrictListParams);

      setFieldId(data.result.fieldId);

      if (data.result.fieldId) {
        setStateData(data.result.values);
      } else {
        console.error("Unexpected fieldId:", data.result.fieldId);
        setStateData([]);
      }
    } catch (error) {
      console.error("Error fetching state data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStateData(searchKeyword);
  }, [searchKeyword]);

  const userProps = {
    userType: t("MASTER.STATE"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_STATE"),
    showStateDropdown: false,
    showAddNew: true,
    showSort: true,
    showFilter: false,
    paginationEnable: true,
  };

  return (
    <>
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
                label: stateDetail.label ?? "",
                value: stateDetail.value,
                createdAt: stateDetail.createdAt,
                updatedAt: stateDetail.updatedAt,
              }))}
              PagesSelector={() => null}
              onEdit={handleEdit}
              onDelete={handleDelete}
              extraActions={[]}
              noDataMessage={
                stateData.length === 0 ? t("COMMON.STATE_NOT_FOUND") : ""
              }
            />
          </div>
        )}
      </HeaderComponent>

      <AddStateModal
        open={addStateModalOpen}
        onClose={() => setAddStateModalOpen(false)}
        onSubmit={(name: string, value: string) =>
          handleAddStateSubmit(name, value, selectedStateForEdit?.value)
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
    </>
  );
};

export const getServerSideProps = async (context: any) => ({
  props: {
    ...(await serverSideTranslations(context.locale, ["common"])),
  },
});

export default State;
