import React, { useState, useEffect } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import HeaderComponent from "@/components/HeaderComponent";
import { Pagination } from "@mui/material";
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
import { transformLabel } from "@/utils/Helper";
import { showToastMessage } from "@/components/Toastify";
import ConfirmationModal from "@/components/ConfirmationModal";
import { AddBlockModal } from "@/components/AddBlockModal";
import PageSizeSelector from "@/components/PageSelector";

type StateDetail = {
  value: string;
  label: string;
};

type DistrictDetail = {
  value: string;
  label: string;
};

type BlockDetail = {
  updatedBy: any;
  createdBy: any;
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
  const [blocksFieldId, setBlocksFieldId] = useState<string>("");
  const [districtFieldId, setDistrictFieldId] = useState<string>("");
  const [sortBy, setSortBy] = useState<[string, string]>(["name", "asc"]);
  const [paginationCount, setPaginationCount] = useState<number>(0);
  const [pageSizeArray, setPageSizeArray] = useState<number[]>([5, 10, 20, 50]);

  //get state list
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const data = await getStateBlockDistrictList({ fieldName: "states" });

        if (data?.result?.values) {
          setStateData(data.result.values);
        } else {
          setStateData([]);
        }
      } catch (error) {
        console.error("Error fetching state data:", error);
        setStateData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  //get district list upon states
  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      try {
        const data = await getDistrictsForState({
          limit: 10,
          offset: 0,
          controllingfieldfk: selectedState,
          fieldName: "districts",
        });
        const districts = data?.result?.values || [];
        setDistrictData(districts);
      } catch (error) {
        console.error("Error fetching districts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [selectedState]);

  //get block list upon district
  useEffect(() => {
    const fetchBlocks = async () => {
      setLoading(true);
      try {
        const response = await getBlocksForDistricts({
          limit: pageLimit,
          offset: pageOffset * pageLimit,
          controllingfieldfk: selectedDistrict,
          fieldName: "blocks",
          sort: sortBy,
        });

        setBlockData(response?.result?.values || []);
        setBlocksFieldId(response?.result?.fieldId || "");
        console.log("Fetched fieldId:", blocksFieldId); // Check if this logs correctly
      } catch (error) {
        console.error("Error fetching blocks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, [selectedDistrict, sortBy, pageOffset, pageLimit]);

  const columns = [
    {
      key: "block",
      title: t("MASTER.BLOCK_NAMES"),
      dataType: DataType.String,
      width:'130'
    },
    {
      key: "value",
      title: t("MASTER.BLOCK_CODE"),
      dataType: DataType.String,
      width:'130'
    },
    {
      key: "createdBy",
      title: t("MASTER.CREATED_AT"),
      dataType: DataType.String,
      width:'130'
    },
    {
      key: "updatedBy",
      title: t("MASTER.UPDATED_AT"),
      dataType: DataType.String,
      width:'130'
    },
    {
      key: "createdAt",
      title: t("MASTER.CREATED_AT"),
      dataType: DataType.String,
      width:'160'
    },
    {
      key: "updatedAt",
      title: t("MASTER.UPDATED_AT"),
      dataType: DataType.String,
      width:'160'
    },
    {
      key: "actions",
      title: t("MASTER.ACTIONS"),
      dataType: DataType.String,
      width:'130'
    },
  ];

  const handleStateChange = async (event: SelectChangeEvent<string>) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);

    try {
      const data = {
        limit: 10,
        offset: 0,
        controllingfieldfk: selectedState,
        fieldName: "districts",
      };
      const response = await getDistrictsForState(data);
      setDistrictData(response.result.values || []);

      console.log("selected state", response);
    } catch (error) {
      console.error("Error fetching district data", error);
    }
  };

  const handleDistrictChange = async (event: SelectChangeEvent<string>) => {
    const selectedDistrict = event.target.value;
    setSelectedDistrict(selectedDistrict);

    try {
      const data = {
        limit: 10,
        offset: 0,
        controllingfieldfk: selectedDistrict,
        fieldName: "blocks",
      };
      const response = await getBlocksForDistricts(data);
      setBlockData(response.result.values || []);
      console.log("fieldId blocks", response);
    } catch (error) {
      console.error("Error fetching district data", error);
    }
  };

  const handleEdit = (rowData: any) => {
    console.log(rowData);
    setModalOpen(true);
    setSelectedStateForEdit(rowData);
  };

  const handleDelete = (rowData: BlockDetail) => {
    console.log("BlockDetails", rowData);
    setSelectedStateForDelete(rowData);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log("selected state for delete", selectedStateForDelete);
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
  };

  const handleChangePageSize = (event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    setPageSizeArray((prev) =>
      prev.includes(newSize) ? prev : [...prev, newSize]
    );
    setPageLimit(newSize);
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageOffset(value - 1);
  };
  const PagesSelector = () => (
    <Box mt={3}>
      <Pagination
        color="primary"
        count={pageCount}
        page={pageOffset + 1}
        onChange={handlePaginationChange}
      />
    </Box>
  );

  const PageSizeSelectorFunction = () => (
    <Box mt={2}>
      <PageSizeSelector
        handleChange={handleChangePageSize}
        pageSize={pageLimit}
        options={pageSizeArray}
      />
    </Box>
  );

  const userProps = {
    selectedSort,
    selectedFilter,
    showStateDropdown: false,
    userType: t("MASTER.BLOCKS"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_BLOCK"),
    showFilter: false,
  };

  const handleAddNewBlock = () => {
    setEditState(null);
    setSelectedStateForEdit(null);
    setModalOpen(true);
    console.log("insdie add state clicked");
  };

  const handleAddDistrictSubmit = async (
    name: string,
    value: string,
    controllingField: string,
    blocksFieldId: string,
    DistrictId?: string
  ) => {
    const newDistrict = {
      options: [
        {
          controllingfieldfk: controllingField,
          name,
          value,
        },
      ],
    };
    console.log("Submitting newDistrict:", newDistrict);

    try {
      const response = await createOrUpdateOption(
        blocksFieldId, // Verify this is being passed correctly
        newDistrict,
        DistrictId
      );

      if (response && response.success) {
        showToastMessage("District added successfully", "success");
      } else {
        showToastMessage("Failed to create/update district", "error");
      }
    } catch (error) {
      console.error("Error adding district:", error);
      showToastMessage("Error adding district", "error");
    }

    setModalOpen(false);
    setSelectedStateForEdit(null);
  };

  return (
    <React.Fragment>
      <AddBlockModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(name: string, value: string, controllingField: string) =>
          handleAddDistrictSubmit(
            name,
            value,
            controllingField,
            blocksFieldId, // This should be checked
            selectedStateForEdit?.value
          )
        }
        fieldId={blocksFieldId}
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
                  createdBy: block.createdBy,
                  updatedBy: block.updatedBy,
                  value: block.value,
                }))}
                limit={pageLimit}
                offset={pageOffset}
                paginationEnable={true}
                PagesSelector={PagesSelector}
                PageSizeSelector={PageSizeSelectorFunction}
                pageSizes={pageSizeArray}
                onEdit={handleEdit}
                onDelete={handleDelete}
                extraActions={[]}
                noDataMessage={
                  blockData.length === 0 ? t("COMMON.BLOCKS_NOT_FOUND") : ""
                }
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
