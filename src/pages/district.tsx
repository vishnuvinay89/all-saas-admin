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
import { showToastMessage } from "@/components/Toastify";
import ConfirmationModal from "@/components/ConfirmationModal";
import Loader from "@/components/Loader";
import AddDistrictModal from "@/components/AddDistrictModal";
import { Chip, Pagination, Typography } from "@mui/material";
import PageSizeSelector from "@/components/PageSelector";
import { Numbers, SORT, Storage } from "@/utils/app.constant";
import {
  createCohort,
  getCohortList,
} from "@/services/CohortService/cohortService";
import useStore from "@/store/store";
import { getUserDetailsInfo } from "@/services/UserList";

type StateDetail = {
  stateCode: string | undefined;
  controllingField: string | undefined;
  value: string;
  label: string;
};

type DistrictDetail = {
  updatedBy: any;
  createdBy: any;
  updatedAt: any;
  createdAt: any;
  value: string;
  label: string;
  controllingField: string;
};

const District: React.FC = () => {
  const { t } = useTranslation();
  const [districtData, setDistrictData] = useState<DistrictDetail[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedStateForEdit, setSelectedStateForEdit] =
    useState<StateDetail | null>(null);
  const [selectedStateForDelete, setSelectedStateForDelete] =
    useState<DistrictDetail | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] =
    useState<boolean>(false);
  const [districtFieldId, setDistrictFieldId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [pageCount, setPageCount] = useState<number>(Numbers.ONE);
  const [pageOffset, setPageOffset] = useState<number>(Numbers.ZERO);
  const [pageLimit, setPageLimit] = useState<number>(Numbers.TEN);
  const [pageSizeArray, setPageSizeArray] = useState<number[]>([5, 10, 20, 50]);
  const [sortBy, setSortBy] = useState<[string, string]>(["name", "asc"]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [paginationCount, setPaginationCount] = useState<number>(Numbers.ZERO);
  const [stateCode, setStateCode] = useState<any>([]);
  const [stateValue, setStateValue] = useState<string>("");
  useState<string>("");
  const [cohortStatus, setCohortStatus] = useState<any>();
  const [cohortId, setCohortId] = useState<any>();
  const [stateFieldId, setStateFieldId] = useState<string>("");
  const [pagination, setPagination] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      let userId: any;
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          userId = localStorage.getItem(Storage.USER_ID);
        }
        const response = await getUserDetailsInfo(userId);
        const statesField = response.userData.customFields.find(
          (field: { label: string }) => field.label === "STATES"
        );
        if (statesField) {
          setStateValue(statesField.value); // state name
          setStateCode(statesField.code); // state code
          setStateFieldId(statesField?.fieldId); // field id of state
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetail();
  }, []);

  const fetchCohortSearch = async () => {
    const limit = pageLimit;
    const offset = pageOffset * limit;

    const reqParams = {
      limit: limit,
      offset: offset,
      filters: {
        name: stateValue,
        type: "STATE",
      },
    };

    const response = await getCohortList(reqParams);
    console.log("getCohortData", response);

    const cohortDetails = response?.results?.cohortDetails;
    console.log("cohortDetails", cohortDetails);
    if (cohortDetails && cohortDetails.length > 0) {
      cohortDetails.forEach(
        (cohort: { customFields: any; cohortId: any; status: any }) => {
          const cohortId = cohort?.cohortId;
          const cohortStatus = cohort?.status;

          setCohortStatus(cohortStatus);
          setCohortId(cohortId);

          const addCustomFieldsState = {
            fieldId: stateFieldId,
            value: stateCode,
          };
          cohort.customFields.push(addCustomFieldsState);
        }
      );
    } else {
      console.error("No cohort details available.");
    }
  };

  useEffect(() => {
    fetchCohortSearch();
  }, [stateCode]);

  const fetchDistrictData = async (stateCode: string) => {
    setLoading(true);
    try {
      const limit = pageLimit;
      const offset = pageOffset * limit;

      const data = {
        limit: limit,
        offset: offset,
        controllingfieldfk: stateCode,
        fieldName: "districts",
        optionName: searchKeyword || "",
        sort: sortBy,
      };

      const districtData = await getDistrictsForState(data);
      setDistrictData(districtData.result.values || []);

      const districtFieldID = districtData?.result?.fieldId || "";
      setDistrictFieldId(districtFieldID);

      const totalCount = districtData?.result?.totalCount || 0;
      setPaginationCount(totalCount);

      setPagination(totalCount > 10);
      setPageSizeArray(
        totalCount > 15
          ? [5, 10, 15]
          : totalCount > 10
            ? [5, 10]
            : totalCount > 5
              ? [5]
              : []
      );

      setPageCount(Math.ceil(totalCount / limit));
    } catch (error) {
      console.error("Error fetching district data:", error);
      setDistrictData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistrictData(stateCode);
  }, [searchKeyword, stateCode, sortBy, pageLimit, pageOffset]);

  const handleEdit = (rowData: DistrictDetail) => {
    setModalOpen(true);

    const updatedRowData = {
      ...rowData,
      stateCode: stateCode,
    };
    setSelectedStateForEdit(updatedRowData);
  };
  const handleDelete = (rowData: DistrictDetail) => {
    setSelectedStateForDelete(rowData);
    setConfirmationDialogOpen(true);
  };
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleConfirmDelete = async () => {
    if (selectedStateForDelete) {
      try {
        await deleteOption("districts", selectedStateForDelete.value);
        setDistrictData((prev) =>
          prev.filter(
            (district) => district.value !== selectedStateForDelete.value
          )
        );
        showToastMessage(t("COMMON.DISTRICT_DELETED_SUCCESS"), "success");
      } catch (error) {
        showToastMessage(t("COMMON.DISTRICT_DELETED_FAILURE"), "error");
      }
    }
    setConfirmationDialogOpen(false);
  };

  const handleAddDistrictSubmit = async (
    name: string,
    value: string,
    controllingField: string,
    DistrictId?: string,
    extraArgument?: any
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
    try {
      const response = await createOrUpdateOption(districtFieldId, newDistrict);

      if (response) {
        await fetchDistrictData(searchKeyword);
        // showToastMessage(t("COMMON.DISTRICT_ADDED_SUCCESS"), "success");
      } else {
        // showToastMessage(t("COMMON.DISTRICT_ADDED_FAILURE"), "error");
      }
    } catch (error) {
      console.error("Error adding district:", error);
    }

    const queryParameters = {
      name: name,
      type: "DISTRICT",
      status: cohortStatus,
      parentId: cohortId, //cohortId of state
      customFields: [
        {
          fieldId: stateFieldId, // state fieldId
          value: [stateCode], // state code
        },
      ],
    };

    try {
      const cohortCreateResponse = await createCohort(queryParameters);
      if (cohortCreateResponse) {
        showToastMessage(t("COMMON.DISTRICT_UPDATED_SUCCESS"), "success");
      } else if (cohortCreateResponse.responseCode === 409) {
        showToastMessage(t("COMMON.DISTRICT_DUPLICATION_FAILURE"), "error");
      }
    } catch (error) {
      console.error("Error creating cohort:", error);
      showToastMessage(t("COMMON.DISTRICT_DUPLICATION_FAILURE"), "error");
    }
    setModalOpen(false);
    setSelectedStateForEdit(null);
  };
  const handleChangePageSize = (event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    setPageSizeArray((prev) =>
      prev.includes(newSize) ? prev : [...prev, newSize]
    );
    setPageLimit(newSize);
  };
  const handleSortChange = async (event: SelectChangeEvent) => {
    const sortOrder =
      event.target.value === "Z-A" ? SORT.DESCENDING : SORT.ASCENDING;
    setSortBy(["name", sortOrder]);
    setSelectedSort(event.target.value);
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageOffset(value - 1);
  };

  const PagesSelector = () => (
    <>
      <Box sx={{ display: { xs: "block" } }}>
        <Pagination
          color="primary"
          count={pageCount}
          page={pageOffset + 1}
          onChange={handlePaginationChange}
          siblingCount={0}
          boundaryCount={1}
          sx={{ marginTop: "10px" }}
        />
      </Box>
    </>
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

  return (
    <>
      <AddDistrictModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(name, value, controllingField) =>
          handleAddDistrictSubmit(
            name,
            value,
            controllingField,
            districtFieldId,
            selectedStateForEdit?.value
          )
        }
        fieldId={districtFieldId}
        initialValues={
          selectedStateForEdit
            ? {
                name: selectedStateForEdit.label,
                value: selectedStateForEdit.value,
                controllingField: selectedStateForEdit.stateCode,
              }
            : {}
        }
      />
      <ConfirmationModal
        modalOpen={confirmationDialogOpen}
        message={t("COMMON.ARE_YOU_SURE_DELETE", {
          state: `${selectedStateForDelete?.label} ${t("COMMON.DISTRICT")}`,
        })}
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
        showStateDropdown={false}
        handleSortChange={handleSortChange}
        showSort={true}
        selectedSort={selectedSort}
        handleSearch={handleSearch}
        showFilter={false}
        handleAddUserClick={() => {
          setModalOpen(true);
          setSelectedStateForEdit(null);
        }}
      >
        {/* Show loader if loading is true */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="20vh" // Adjust height as needed
          >
            <Loader showBackdrop={false} loadingText={t("COMMON.LOADING")} />
          </Box>
        ) : (
          <>
            <Box display="flex" gap={2}>
              <FormControl
                variant="outlined"
                sx={{ minWidth: 220, marginTop: 2 }}
              >
                <InputLabel id="state-select-label">{stateValue}</InputLabel>
                <Select labelId="state-select-label" id="state-select" disabled>
                  <MenuItem key={stateCode} value={stateCode}>
                    {transformLabel(stateValue)}
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {districtData.length > 0 ? (
              <KaTableComponent
                columns={[
                  {
                    key: "label",
                    title: t("COMMON.DISTRICT"),
                    dataType: DataType.String,
                    width: "130",
                  },
                  {
                    key: "value",
                    title: t("MASTER.DISTRICT_CODE"),
                    dataType: DataType.String,
                    width: "130",
                  },
                  {
                    key: "createdBy",
                    title: t("MASTER.CREATED_BY"),
                    width: "130",
                  },
                  {
                    key: "updatedBy",
                    title: t("MASTER.UPDATED_BY"),
                    width: "130",
                  },
                  {
                    key: "createdAt",
                    title: t("MASTER.CREATED_AT"),
                    width: "160",
                  },
                  {
                    key: "updatedAt",
                    title: t("MASTER.UPDATED_AT"),
                    width: "160",
                  },
                  {
                    key: "actions",
                    title: t("MASTER.ACTIONS"),
                    dataType: DataType.String,
                    width: "130",
                  },
                ]}
                data={districtData.map((districtDetail) => ({
                  label: transformLabel(districtDetail.label),
                  createdAt: districtDetail.createdAt,
                  updatedAt: districtDetail.updatedAt,
                  createdBy: districtDetail.createdBy,
                  updatedBy: districtDetail.updatedBy,
                  value: districtDetail.value,
                }))}
                limit={pageLimit}
                offset={pageOffset}
                paginationEnable={paginationCount >= Numbers.FIVE}
                PagesSelector={PagesSelector}
                PageSizeSelector={PageSizeSelectorFunction}
                pageSizes={pageSizeArray}
                pagination={pagination}
                onEdit={handleEdit}
                onDelete={handleDelete}
                extraActions={[]}
                noDataMessage={t("COMMON.DISTRICT_NOT_FOUND")}
              />
            ) : (
              !loading && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="20vh" // Adjust height as needed
                >
                  <Typography marginTop="10px" textAlign="center">
                    {t("COMMON.DISTRICT_NOT_FOUND")}
                  </Typography>
                </Box>
              )
            )}
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
