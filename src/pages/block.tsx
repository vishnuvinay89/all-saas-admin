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
import { SORT, Storage } from "@/utils/app.constant";
import { getUserDetailsInfo } from "@/services/UserList";
import {
  createCohort,
  getCohortList,
} from "@/services/CohortService/cohortService";
import { Numbers } from "@/utils/app.constant";

type StateDetail = {
  block: string | undefined;
  selectedDistrict: string | undefined;
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
    useState<BlockDetail | null>(null);
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
  const [initialDistrict, setInitialDistrict] = useState<string>("");
  const [stateCode, setStateCode] = useState<any>([]);
  const [stateValue, setStateValue] = useState<string>("");
  const [cohortStatus, setCohortStatus] = useState<any>();
  const [cohortId, setCohortId] = useState<any>();
  const [stateFieldId, setStateFieldId] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchUserDetail = async () => {
      let userId: any;
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          userId = localStorage.getItem(Storage.USER_ID);
        }
        const response = await getUserDetailsInfo(userId);

        console.log("profile api is triggered", response.userData.customFields);

        const statesField = response.userData.customFields.find(
          (field: { label: string }) => field.label === "STATES"
        );

        console.log("stateField", statesField);

        if (statesField) {
          setStateValue(statesField.value);
          setStateCode(statesField.code);
          setStateFieldId(statesField?.fieldId);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetail();
  }, []);

  //get district list upon states
  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      try {
        const limit = pageLimit;
        const offset = pageOffset * limit;

        const data = await getDistrictsForState({
          limit: limit,
          offset: offset,
          controllingfieldfk: selectedState,
          fieldName: "districts",
        });
        const districts = data?.result?.values || [];
        setDistrictData(districts);
        setInitialDistrict(districts[0].value);
        const districtFieldID = data?.result?.fieldId || "";
        setDistrictFieldId(districtFieldID);
      } catch (error) {
        console.error("Error fetching districts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [selectedState]);

  //get block list upon district
  const fetchBlocks = async (DistrictId: string) => {
    console.log("districtId", DistrictId);
    setLoading(true);
    try {
      const limit = pageLimit;
      const offset = pageOffset * limit;

      const response = await getBlocksForDistricts({
        limit: limit,
        offset: offset,
        controllingfieldfk: selectedDistrict || "",
        fieldName: "blocks",
        optionName: searchKeyword || "",
        sort: sortBy,
      });

      console.log("block response", response);
      setBlockData(response?.result?.values || []);

      const blockFieldID = response?.result?.fieldId || "";

      console.log("blockFieldID", blockFieldID);
      setBlocksFieldId(blockFieldID);

      console.log("new blockFeldId", blocksFieldId);

      const totalCount = response?.result?.totalCount || 0;
      setPaginationCount(totalCount);

      setPageSizeArray(
        totalCount >= 15 ? [5, 10, 15, 20] : totalCount >= 10 ? [5, 10] : [5]
      );

      setPageCount(Math.ceil(totalCount / limit));
    } catch (error) {
      console.error("Error fetching blocks", error);
      setBlockData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks(selectedDistrict);
  }, [searchKeyword, selectedDistrict, sortBy, pageOffset, pageLimit]);

  const columns = [
    {
      key: "block",
      title: t("MASTER.BLOCK_NAMES"),
      dataType: DataType.String,
      width: "130",
    },
    {
      key: "value",
      title: t("MASTER.BLOCK_CODE"),
      dataType: DataType.String,
      width: "130",
    },
    {
      key: "createdBy",
      title: t("MASTER.CREATED_BY"),
      dataType: DataType.String,
      width: "160",
    },
    {
      key: "updatedBy",
      title: t("MASTER.UPDATED_BY"),
      dataType: DataType.String,
      width: "160",
    },

    {
      key: "createdAt",
      title: t("MASTER.CREATED_AT"),
      dataType: DataType.String,
      width: "130",
    },
    {
      key: "updatedAt",
      title: t("MASTER.UPDATED_AT"),
      dataType: DataType.String,
      width: "130",
    },
    {
      key: "actions",
      title: t("MASTER.ACTIONS"),
      dataType: DataType.String,
      width: "130",
    },
  ];

  const handleSortChange = async (event: SelectChangeEvent) => {
    const sortOrder =
      event.target.value === "Z-A" ? SORT.DESCENDING : SORT.ASCENDING;
    setSortBy(["name", sortOrder]);
    setSelectedSort(event.target.value);
  };

  const handleStateChange = async (event: SelectChangeEvent<string>) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);

    try {
      const limit = pageLimit;
      const offset = pageOffset * limit;
      const data = {
        limit: limit,
        offset: offset,
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

    if (selectedDistrict) {
      const limit = pageLimit;
      const offset = pageOffset * limit;
      const reqParams = {
        limit: limit,
        offset: offset,
        filters: {
          name: selectedDistrict,
          type: "DISTRICT",
        },
      };

      console.log("reqParams block", reqParams);

      const response = await getCohortList(reqParams);
      console.log("getCohortData", response);

      const cohortDetails = response?.results?.cohortDetails;
      console.log("cohort detail at block", cohortDetails);

      if (cohortDetails && cohortDetails.length > 0) {
        cohortDetails.forEach(
          (cohort: { customFields: any; cohortId: any; status: any }) => {
            const cohortId = cohort?.cohortId;
            const cohortStatus = cohort?.status;

            setCohortStatus(cohortStatus);
            setCohortId(cohortId);

            const addCustomFieldsState = {
              fieldId: stateFieldId,
              value: selectedState,
            };
            cohort.customFields.push(addCustomFieldsState);

            const addCustomFieldsDistrict = {
              fieldId: districtFieldId,
              value: selectedDistrict,
            };
            cohort.customFields.push(
              addCustomFieldsState,
              addCustomFieldsDistrict
            );
          }
        );
      } else {
        console.error("No cohort details available.");
      }
    }
  };

  const handleEdit = (rowData: any) => {
    setModalOpen(true);
    const updatedRowData = {
      ...rowData,
      selectedDistrict: selectedDistrict,
    };

    setSelectedStateForEdit(updatedRowData);
  };

  const handleDelete = (rowData: BlockDetail) => {
    setSelectedStateForDelete(rowData);
    setConfirmationDialogOpen(true);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleConfirmDelete = async () => {
    if (selectedStateForDelete) {
      try {
        await deleteOption("blocks", selectedStateForDelete.value);
        setStateData((prevStateData) =>
          prevStateData.filter(
            (state) => state.value !== selectedStateForDelete.value
          )
        );
        showToastMessage(t("COMMON.BLOCK_DELETED_SUCCESS"), "success");
      } catch (error) {
        console.error("Error deleting state", error);
        showToastMessage(t("COMMON.BLOCK_DELETED_FAILURE"), "error");
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
    selectedFilter,
    showStateDropdown: false,
    userType: t("MASTER.BLOCKS"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_BLOCK"),
    showFilter: false,
    showSort: true,
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
    blocksFieldId: string
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
      const response = await createOrUpdateOption(blocksFieldId, newDistrict);

      console.log("submit response district", response);
      const queryParameters = {
        name: name,
        type: "BLOCK",
        status: cohortStatus,
        parentId: cohortId, //cohortId of district
        customFields: [
          {
            fieldId: stateFieldId, // district fieldId
            value: [selectedState], // district code
          },

          {
            fieldId: districtFieldId, // district fieldId
            value: [selectedDistrict], // district code
          },
        ],
      };

      const cohortList = await createCohort(queryParameters);

      console.log("fetched cohorlist in block success", cohortList);

      if (response) {
        fetchBlocks(blocksFieldId);
        showToastMessage(t("COMMON.BLOCK_ADDED_SUCCESS"), "success");
      } else {
        showToastMessage(t("COMMON.BLOCK_ADDED_FAILURE"), "success");
      }
    } catch (error) {
      console.error("Error adding block:", error);
      showToastMessage(t("COMMON.BLOCK_UPDATED_FAILURE"), "error");
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
          handleAddDistrictSubmit(name, value, controllingField, blocksFieldId)
        }
        fieldId={blocksFieldId}
        initialValues={
          selectedStateForEdit
            ? {
                controllingField: selectedStateForEdit.selectedDistrict,
                name: selectedStateForEdit.block,
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
        {...userProps}
        handleAddUserClick={handleAddNewBlock}
        handleSearch={handleSearch}
        selectedSort={selectedSort}
        handleSortChange={handleSortChange}
        showSort={true}
      >
        <>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              marginTop: 2,
              "@media (max-width: 580px)": {
                width: "100%",
                flexDirection: "column",
              },
            }}
          >
            <FormControl
              sx={{
                width: "25%",
                "@media (max-width: 580px)": {
                  width: "100%",
                },
              }}
            >
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
                <MenuItem key={stateCode} value={stateCode}>
                  {transformLabel(stateValue)}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              sx={{
                width: "25%", // Default width for larger screens
                "@media (max-width: 580px)": {
                  width: "100%", // Full width for small screens
                },
              }}
            >
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
                paginationEnable={paginationCount >= Numbers.FIVE}
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
