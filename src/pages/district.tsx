import React, { useState, useEffect } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HeaderComponent from "@/components/HeaderComponent";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "next-i18next";
import { DataType } from "ka-table/enums";
import {
  getStateBlockDistrictList,
  getDistrictsForState,
  createOrUpdateOption,
  deleteOption,
} from "@/services/MasterDataService";
import { transformLabel } from "@/utils/Helper";
import { AddDistrictBlockModal } from "@/components/AddDistrictBlockModal";
import { showToastMessage } from "@/components/Toastify";
import ConfirmationModal from "@/components/ConfirmationModal";
import Loader from "@/components/Loader";

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
  const [stateData, setStateData] = useState<StateDetail[]>([]);
  const [districtData, setDistrictData] = useState<DistrictDetail[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedStateForEdit, setSelectedStateForEdit] =
    useState<StateDetail | null>(null);
  const [selectedStateForDelete, setSelectedStateForDelete] =
    useState<DistrictDetail | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const [districtFieldId, setDistrictFieldId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        setLoading(true);
        const data = await getStateBlockDistrictList({ fieldName: "states" });
        if (data?.result?.fieldId) {
          setStateData(data.result.values);
          const initialSelectedState = data.result.values[0]?.value || "";
          setSelectedState(initialSelectedState);

          fetchDistrictData(initialSelectedState);
        } else {
          setStateData([]);
        }
      } catch (error) {
        setStateData([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchDistrictData = async (stateId: any) => {
      try {
        const initialDistrictData = await getDistrictsForState({
          controllingfieldfk: stateId,
          fieldName: "districts",
        });
        setDistrictFieldId(initialDistrictData?.result?.fieldId || "");
        if (initialDistrictData?.result?.fieldId) {
          setDistrictData(initialDistrictData.result.values || []);
        } else {
          setDistrictData([]);
        }
      } catch (error) {
        setDistrictData([]);
      }
    };

    fetchStateData();
  }, []);

  const handleStateChange = async (event: SelectChangeEvent<string>) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);

    try {
      const data = await getDistrictsForState({
        controllingfieldfk: selectedState,
        fieldName: "districts",
      });
      setDistrictData(data.result.values || []);
    } catch (error) {
      console.error("Error fetching district data", error);
    }
  };

  const handleEdit = (rowData: DistrictDetail) => {
    setModalOpen(true);
    setSelectedStateForEdit(rowData);
  };

  const handleDelete = (rowData: DistrictDetail) => {
    setSelectedStateForDelete(rowData);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedStateForDelete) {
      try {
        await deleteOption("districts", selectedStateForDelete.value);
        setDistrictData((prev) =>
          prev.filter(
            (district) => district.value !== selectedStateForDelete.value,
          ),
        );
        showToastMessage(t("COMMON.STATE_DELETED_SUCCESS"), "success");
      } catch (error) {
        showToastMessage(t("COMMON.STATE_DELETED_FAILURE"), "error");
      }
    }
    setConfirmationDialogOpen(false);
  };

  const handleAddDistrictSubmit = async (
    name: string,
    value: string,
    controllingField: string,
    fieldId: string,
    DistrictId?: string,
  ) => {
    const newDistrict = {
      options: [
        {
          controllingField,
          name,
          value,
        },
      ],
    };

    try {
      const response = await createOrUpdateOption(
        fieldId,
        newDistrict,
        DistrictId,
      );

      if (response) {
        showToastMessage("District added successfully", "success");
      } else {
        showToastMessage("Failed to create/update district", "error");
      }
    } catch (error) {
      showToastMessage("Error adding district", "error");
    }

    setModalOpen(false);
    setSelectedStateForEdit(null);
  };

  return (
    <>
      <AddDistrictBlockModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(name, value, controllingField) =>
          handleAddDistrictSubmit(
            name,
            value,
            controllingField,
            districtFieldId,
            selectedStateForEdit?.value,
          )
        }
        fieldId={districtFieldId}
        initialValues={
          selectedStateForEdit
            ? {
                controllingField: selectedStateForEdit.value,
                name: selectedStateForEdit.label,
                value: selectedStateForEdit.value,
              }
            : {}
        }
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
        userType={t("MASTER.DISTRICTS")}
        searchPlaceHolder={t("MASTER.SEARCHBAR_PLACEHOLDER_DISTRICT")}
        states={stateData.map((state) => state.value)}
        districts={districtData.map((district) => district.label)}
        selectedState={selectedState}
        showStateDropdown={false}
        handleSearch={() => {}}
        showFilter={false}
        handleAddUserClick={() => {
          setModalOpen(true);
          setSelectedStateForEdit(null);
        }}
      >
        {loading ? (
          <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />
        ) : (
          <>
            <Box display="flex" gap={2}>
              <FormControl
                variant="outlined"
                sx={{ minWidth: 220, marginTop: 2 }}
              >
                <InputLabel id="state-select-label">
                  {t("MASTER.STATE")}
                </InputLabel>
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
              columns={[
                {
                  key: "label",
                  title: t("MASTER.DISTRICT_NAMES"),
                  dataType: DataType.String,
                },
                {
                  key: "value",
                  title: t("MASTER.DISTRICT_CODE"),
                  dataType: DataType.String,
                },
                { key: "createdAt", title: t("MASTER.CREATED_AT") },
                { key: "updatedAt", title: t("MASTER.UPDATED_AT") },
                {
                  key: "actions",
                  title: t("MASTER.ACTIONS"),
                  dataType: DataType.String,
                },
              ]}
              data={districtData.map((districtDetail) => ({
                label: transformLabel(districtDetail.label),
                createdAt: districtDetail.createdAt,
                updatedAt: districtDetail.updatedAt,
                value: districtDetail.value,
              }))}
              PagesSelector={() => null}
              onEdit={handleEdit}
              onDelete={handleDelete}
              extraActions={[]}
            />
          </>
        )}
      </HeaderComponent>
    </>
  );
};

export default District;

export const getServerSideProps = async (context: any) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common", "master"])),
    },
  };
};
