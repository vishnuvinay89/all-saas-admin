import React, { useState, useMemo, useCallback, useEffect } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import HeaderComponent from "@/components/HeaderComponent";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "next-i18next";
import Loader from "@/components/Loader";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  getStateBlockDistrictList,
  getDistrictsForState,
  getBlocksForDistricts,
  deleteOption,
  createOrUpdateOption,
} from "@/services/MasterDataService";
import CustomModal from "@/components/CustomModal";
import { transformLabel } from "@/utils/Helper";
import { showToastMessage } from "@/components/Toastify";
import ConfirmationModal from "@/components/ConfirmationModal";
import { AddDistrictBlockModal } from "@/components/AddDistrictBlockModal";

type StateDetail = {
  value: string;
  label: string;
};

type DistrictDetail = {
  value: string;
  label: string;
};

type BlockDetail = {
  updatedAt: any;
  createdAt: any;
  value: string;
  label: string;
};

const Block: React.FC = () => {
  const { t } = useTranslation();
  const [selectedSort, setSelectedSort] = useState<string>("Sort");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [stateData, setStateData] = useState<StateDetail[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [districtData, setDistrictData] = useState<DistrictDetail[]>([]);
  const [blockData, setBlockData] = useState<BlockDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageCount, setPageCount] = useState<number>(1);
  const [selectedStateForDelete, setSelectedStateForDelete] =
    useState<StateDetail | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editState, setEditState] = useState<StateDetail | null>(null);
  const [selectedStateForEdit, setSelectedStateForEdit] =
    useState<StateDetail | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      try {
        const data = await getStateBlockDistrictList({ fieldName: "states" });
        const states = data?.result?.values || [];
        setStateData(states);
        if (states.length > 0) {
          setSelectedState(states[0].value); // Set the first state as selected by default
        }
      } catch (error) {
        console.error("Error fetching states", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedState) {
        setLoading(true);
        try {
          const data = await getDistrictsForState({
            controllingfieldfk: selectedState,
            fieldName: "districts",
          });
          const districts = data?.result?.values || [];
          setDistrictData(districts);
          if (districts.length > 0) {
            setSelectedDistrict(districts[0].value); // Set the first district as selected by default
          }
        } catch (error) {
          console.error("Error fetching districts", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDistricts();
  }, [selectedState]);

  useEffect(() => {
    const fetchBlocks = async () => {
      if (selectedDistrict) {
        setLoading(true);
        try {
          const data = await getBlocksForDistricts({
            controllingfieldfk: selectedDistrict,
            fieldName: "blocks",
          });
          setBlockData(data?.result?.values || []);
        } catch (error) {
          console.error("Error fetching blocks", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBlocks();
  }, [selectedDistrict]);

  const columns = useMemo(
    () => [
      {
        key: "block",
        title: t("MASTER.BLOCK_NAMES"),
        dataType: DataType.String,
      },
      {
        key: "value",
        title: t("MASTER.BLOCK_CODE"),
        dataType: DataType.String,
      },
      {
        key: "createdAt",
        title: t("MASTER.CREATED_AT"),
        dataType: DataType.String,
      },
      {
        key: "updatedAt",
        title: t("MASTER.UPDATED_AT"),
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

  const handleStateChange = useCallback(
    async (event: SelectChangeEvent<string>) => {
      const selectedState = event.target.value;
      setSelectedState(selectedState);

      try {
        const data = await getDistrictsForState({
          controllingfieldfk: selectedState,
          fieldName: "blocks",
        });
        setDistrictData(data.result.values || []);
        setSelectedDistrict("-");
      } catch (error) {
        console.error("Error fetching district data", error);
      }
    },
    []
  );

  const handleDistrictChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setSelectedDistrict(event.target.value);
    },
    []
  );

  const handleEdit = useCallback((rowData: any) => {
    console.log(rowData);
    setModalOpen(true);
    setSelectedStateForEdit(rowData);
  }, []);

  const handleDelete = useCallback((rowData: BlockDetail) => {
    console.log("BlockDetails",rowData);
    setSelectedStateForDelete(rowData);
    setConfirmationDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    console.log("selected state for delte", selectedStateForDelete);
    if (selectedStateForDelete) {
      try {
        await deleteOption("blocks", selectedStateForDelete.value);
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

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageOffset(value - 1);
  };

  useEffect(() => {
    const sortedAndPaginatedData = () => {
      if (blockData.length === 0) {
        setPageCount(1);
        return;
      }
      const sortedData = [...blockData];
      const paginatedData = sortedData.slice(
        pageOffset * pageLimit,
        (pageOffset + 1) * pageLimit
      );
      setPageCount(Math.ceil(sortedData.length / pageLimit));
    };

    sortedAndPaginatedData();
  }, [blockData, pageOffset, pageLimit]);

  const userProps = {
    selectedSort,
    selectedFilter,
    showStateDropdown: false,
    userType: t("MASTER.BLOCKS"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_BLOCK"),
    showFilter: false,
  };

  const showPagination = blockData.length > pageLimit;
  const handleAddNewBlock = () => {
    setEditState(null);
    setModalOpen(true);
    console.log("insdie add state clicked");
  };

  const handleAddDistrictSubmit = async (
    name: string,
    value: string,
    controllingField: string,
    fieldId: string,
    DistrictId?: string
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
    console.log("Submitting newDistrict:", newDistrict);

    try {
      const response = await createOrUpdateOption(
        fieldId,
        newDistrict,
        DistrictId
      );

      console.log("submit response:", response);

      if (response) {
        showToastMessage("District added successfully", "success");
      } else {
        showToastMessage("Failed to create/update district", "error");
      }
    } catch (error) {
      console.error("Error creating/updating district:", error);
      showToastMessage("Error adding district", "error");
    }

    setModalOpen(false);
  };

  const fieldId = "4aab68ae-8382-43aa-a45a-e9b239319857";

  return (
    <React.Fragment>
      <AddDistrictBlockModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(name: string, value: string, controllingField: string) =>
          handleAddDistrictSubmit(name, value, controllingField, fieldId)
        }
        fieldId={fieldId}
        initialValues={
          selectedStateForEdit
            ? {
                controllingField: selectedStateForEdit.value,
                name: selectedStateForEdit.label,
                value: selectedStateForEdit.value,
              }
            : {}
        }
        districtId={selectedStateForEdit?.value}
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

      <HeaderComponent {...userProps} handleAddUserClick={handleAddNewBlock}>
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 5,
              marginTop: 2,
              "@media (max-width: 580px)": {
                marginTop: 10,
                flexDirection: "column",
                alignItems: "center",
              },
            }}
          >
            <Box sx={{ width: "100%" }}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel
                  sx={{ backgroundColor: "#F7F7F7", padding: "2px 8px" }}
                  id="state-select-label"
                >
                  {t("MASTER.STATE")}
                </InputLabel>
                <Select
                  labelId="state-select-label"
                  id="state-select"
                  value={selectedState}
                  onChange={handleStateChange}
                >
                  {stateData.map((stateDetail) => (
                    <MenuItem key={stateDetail.value} value={stateDetail.value}>
                      {transformLabel(stateDetail.label)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: "100%" }}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel
                  sx={{ backgroundColor: "#F7F7F7", padding: "2px 8px" }}
                  id="district-select-label"
                >
                  {t("MASTER.DISTRICTS")}
                </InputLabel>
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
                      {transformLabel(districtDetail.label)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ marginTop: 2 }}>
            {loading ? (
              <Loader showBackdrop={true} loadingText="Loading..." />
            ) : (
              <KaTableComponent
                columns={columns}
                data={blockData.map((block) => ({
                  block: transformLabel(block.label),
                  createdAt: block.createdAt,
                  updatedAt: block.updatedAt,
                  value: block.value,
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
                      shape="rounded"
                      variant="outlined"
                      size="small"
                    />
                  )
                }
                onEdit={handleEdit}
                onDelete={handleDelete}
                extraActions={[]}
              />
            )}
          </Box>
        </>
      </HeaderComponent>
    </React.Fragment>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Block;
