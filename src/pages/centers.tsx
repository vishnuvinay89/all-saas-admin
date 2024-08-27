import React, { ChangeEvent, useState, useEffect, useCallback } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType, SortDirection } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HeaderComponent from "@/components/HeaderComponent";
import { useTranslation } from "next-i18next";
import Pagination from "@mui/material/Pagination";
import { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import {
  fetchCohortMemberList,
  getCohortList,
  updateCohortUpdate,
} from "@/services/CohortService/cohortService";
import {
  CohortTypes,
  FormValues,
  Numbers,
  SORT,
  Status,
  Storage,
} from "@/utils/app.constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "@/components/ConfirmationModal";
import CustomModal from "@/components/CustomModal";
import {
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Loader from "@/components/Loader";
import { getFormRead } from "@/services/CreateUserService";
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from "@/components/GeneratedSchemas";
import { CustomField } from "@/utils/Interfaces";
import { showToastMessage } from "@/components/Toastify";
import AddNewCenters from "@/components/AddNewCenters";
import { getCenterTableData } from "@/data/tableColumns";
import { Theme } from "@mui/system";
import { firstLetterInUpperCase, mapFields } from "@/utils/Helper";
import SimpleModal from "@/components/SimpleModal";
import { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import DynamicForm from "@/components/DynamicForm";
import useSubmittedButtonStore from "@/utils/useSharedState";
import { getUserDetailsInfo } from "@/services/UserList";

type cohortFilterDetails = {
  type?: string;
  status?: any;
  states?: string;
  districts?: string;
  blocks?: string;
  name?: string;
  activeMembers?: string;
  archivedMembers?: string;
};

interface centerData {
  name?: string;
  status?: string;
  updatedBy?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  customFieldValues?: string;
}
interface CohortDetails {
  name?: string;
  type?: string;
  parentId?: string | null;
  customFields?: CustomField[];
}

const Center: React.FC = () => {
  // use hooks
  const { t } = useTranslation();
  const adminInformation = useSubmittedButtonStore(
    (state: any) => state.adminInformation
  );
  const state = adminInformation?.customFields?.find(
    (item: any) => item?.label === "STATES"
  );
  const getUserStateName = state ? state.value : null;
  const stateCode = state ? state?.code : null;
  // handle states
  const [selectedState, setSelectedState] = React.useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = React.useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = React.useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [selectedFilter, setSelectedFilter] = useState("Active");
  const [cohortData, setCohortData] = useState<cohortFilterDetails[]>([]);
  const [pageSize, setPageSize] = React.useState<string | number>(10);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState<boolean>(false);
  const [confirmationModalOpenForActive, setConfirmationModalOpenForActive] =
    React.useState<boolean>(false);
  const [selectedCohortId, setSelectedCohortId] = React.useState<string>("");
  const [editModelOpen, setIsEditModalOpen] = React.useState<boolean>(false);
  const [confirmButtonDisable, setConfirmButtonDisable] =
    React.useState<boolean>(false);
  const [inputName, setInputName] = React.useState<string>("");
  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [userId, setUserId] = useState("");
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [openAddNewCohort, setOpenAddNewCohort] =
    React.useState<boolean>(false);
  const [statusValue, setStatusValue] = useState(Status.ACTIVE);

  const [pageCount, setPageCount] = useState(Numbers.ONE);
  const [pageOffset, setPageOffset] = useState(Numbers.ZERO);
  const [pageLimit, setPageLimit] = useState(Numbers.TEN);
  const [pageSizeArray, setPageSizeArray] = React.useState<number[]>([]);
  const [pagination, setPagination] = useState(true);
  const [sortBy, setSortBy] = useState(["createdAt", "asc"]);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedBlockCode, setSelectedBlockCode] = useState("");
  const [formdata, setFormData] = useState<any>();
  const [totalCount, setTotalCound] = useState<number>(0);
  const [editFormData, setEditFormData] = useState<any>([]);
  const [isEditForm, setIsEditForm] = useState(false);
  const [statesInformation, setStatesInformation] = useState<any>([]);
  const [selectedRowData, setSelectedRowData] = useState<any>("");
  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );
  const setAdminInformation = useSubmittedButtonStore(
    (state: any) => state.setAdminInformation
  );

  const [filters, setFilters] = useState<cohortFilterDetails>({
    type: CohortTypes.COHORT,
    states: selectedStateCode,
    status: [statusValue],
  });
  const handleCloseAddLearnerModal = () => {
    setOpenAddNewCohort(false);
  };
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const getAdminInformation = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      const admin = localStorage.getItem("adminInfo");
      if (admin) {
        const stateField: any = JSON.parse(admin).customFields.find(
          (field: any) => field.label === "STATES"
        );
        console.log(stateField.value, stateField.code);
        const object = [
          {
            value: stateField.code,
            label: stateField.value,
          },
        ];

        setStatesInformation(object);
        setSelectedStateCode(object[0]?.value);

        setFilters({
          type: "COHORT",
          states: object[0]?.value,
          status: filters.status,
        });
      }
    }
  };

  // use api calls
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const userId = localStorage.getItem(Storage.USER_ID) || "";
      setUserId(userId);
    }

    // get form data for center create
    getAddCenterFormData();
    // getCohortMemberlistData();
    getAdminInformation();
  }, []);

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const limit = pageLimit;
      const offset = pageOffset * limit;
      const sort = sortBy;

      const data = {
        limit: limit,
        offset: offset,
        sort: sort,
        filters: filters,
      };
      const resp = await getCohortList(data);
      if (resp) {
        const result = resp?.results?.cohortDetails;
        const resultData: centerData[] = [];

        const cohortIds = result.map((item: any) => item.cohortId); // Extract cohort IDs

        // Fetch member counts for each cohort
        const memberCounts = await Promise.all(
          cohortIds?.map(async (cohortId: string) => {
            return await getCohortMemberlistData(cohortId);
          })
        );

        result?.forEach((item: any, index: number) => {
          const cohortType =
            item?.customFields?.map((field: any) =>
              firstLetterInUpperCase(field?.value)
            ) ?? "-";

          const counts = memberCounts[index] || {
            totalActiveMembers: 0,
            totalArchivedMembers: 0,
          };

          console.log("cohortType", cohortType);
          const requiredData = {
            name: item?.name,
            status: item?.status,
            updatedBy: item?.updatedBy,
            createdBy: item?.createdBy,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt,
            cohortId: item?.cohortId,
            customFieldValues: cohortType[0] ? cohortType : "-",
            totalActiveMembers: counts?.totalActiveMembers,
            totalArchivedMembers: counts?.totalArchivedMembers,
          };
          resultData?.push(requiredData);
        });
        setCohortData(resultData);
        const totalCount = resp?.count;
        setTotalCound(totalCount);

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
        const pageCount = Math.ceil(totalCount / pageLimit);
        setPageCount(pageCount);
        setLoading(false);
      }
    } catch (error) {
      setCohortData([]);
      setLoading(false);
      console.error("Error fetching user list:", error);
    }
  };

  const getFormData = async () => {
    try {
      const res = await getFormRead("cohorts", "cohort");
      if (res && res?.fields) {
        const formDatas = res?.fields;
        setFormData(formDatas);
      } else {
        console.log("No response Data");
      }
    } catch (error) {
      showToastMessage(t("COMMON.ERROR_MESSAGE_SOMETHING_WRONG"), "error");
      console.log("Error fetching form data:", error);
    }
  };

  const getCohortMemberlistData = async (cohortId: string) => {
    const data = {
      limit: 300,
      page: 0,
      filters: {
        cohortId: cohortId,
      },
    };

    const response: any = await fetchCohortMemberList(data);

    if (response?.result) {
      const userDetails = response.result.userDetails;
      const getActiveMembers = userDetails?.filter(
        (member: any) => member?.status === Status.ACTIVE
      );
      const totalActiveMembers = getActiveMembers?.length || 0;

      const getArchivedMembers = userDetails?.filter(
        (member: any) => member?.status === Status.ARCHIVED
      );
      const totalArchivedMembers = getArchivedMembers?.length || 0;

      return {
        totalActiveMembers,
        totalArchivedMembers,
      };
    }

    return {
      totalActiveMembers: 0,
      totalArchivedMembers: 0,
    };
  };

  const getAddCenterFormData = async () => {
    try {
      const response = await getFormRead("cohorts", "cohort");
      if (response) {
        const { schema, uiSchema } = GenerateSchemaAndUiSchema(response, t);

        setSchema(schema);
        setUiSchema(uiSchema);
      } else {
        console.log("Unexpected response format");
      }
    } catch (error) {
      showToastMessage(t("COMMON.ERROR_MESSAGE_SOMETHING_WRONG"), "error");
      console.log("Error fetching form data:", error);
    }
  };

  useEffect(() => {
    fetchUserList();
    getFormData();
  }, [pageOffset, pageLimit, sortBy, filters, filters.states, filters.status]);

  // handle functions
  const handleChange = (event: SelectChangeEvent<typeof pageSize>) => {
    setPageSize(event.target.value);
    setPageLimit(Number(event.target.value));
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageOffset(value - 1);
  };

  const PagesSelector = () => (
    <Box sx={{ display: { xs: "block" } }}>
      <Pagination
        // size="small"
        color="primary"
        count={pageCount}
        page={pageOffset + 1}
        onChange={handlePaginationChange}
        siblingCount={0}
        boundaryCount={1}
        sx={{ marginTop: "10px" }}
      />
    </Box>
  );

  const PageSizeSelectorFunction = () => (
    <Box mt={2}>
      <PageSizeSelector
        handleChange={handleChange}
        pageSize={pageSize}
        options={pageSizeArray}
      />
    </Box>
  );

  const handleStateChange = async (selected: string[], code: string[]) => {
    setSelectedDistrict([]);
    setSelectedBlock([]);
    setSelectedState(selected);

    if (selected[0] === "") {
      if (filters.status)
        setFilters({ type: "COHORT", status: filters.status });
      // else setFilters({ role: role });
    } else {
      const stateCodes = code?.join(",");
      console.log("stateCodes", stateCodes);
      setSelectedStateCode(stateCodes);
      if (filters.status)
        setFilters({
          type: "COHORT",
          states: stateCodes,
          status: filters.status,
        });
      else setFilters({ type: "COHORT", states: stateCodes });
    }

    console.log("Selected categories:", typeof code[0]);
  };

  const handleDistrictChange = (selected: string[], code: string[]) => {
    setSelectedBlock([]);
    setSelectedDistrict(selected);

    if (selected[0] === "") {
      if (filters.status) {
        setFilters({
          states: selectedStateCode,
          status: filters.status,
        });
      } else {
        setFilters({
          states: selectedStateCode,
        });
      }
    } else {
      const districts = code?.join(",");
      setSelectedDistrictCode(districts);
      if (filters.status) {
        setFilters({
          states: selectedStateCode,
          districts: districts,
          status: filters.status,
        });
      } else {
        setFilters({
          states: selectedStateCode,
          districts: districts,
        });
      }
    }
    console.log("Selected categories:", selected);
  };
  const handleBlockChange = (selected: string[], code: string[]) => {
    setSelectedBlock(selected);
    if (selected[0] === "") {
      if (filters.status) {
        setFilters({
          states: selectedStateCode,
          districts: selectedDistrictCode,
          status: filters.status,
        });
      } else {
        setFilters({
          states: selectedStateCode,
          districts: selectedDistrictCode,
        });
      }
    } else {
      const blocks = code?.join(",");
      setSelectedBlockCode(blocks);
      if (filters.status) {
        setFilters({
          states: selectedStateCode,
          districts: selectedDistrictCode,
          blocks: blocks,
          status: filters.status,
        });
      } else {
        setFilters({
          states: selectedStateCode,
          districts: selectedDistrictCode,
          blocks: blocks,
        });
      }
    }
    console.log("Selected categories:", selected);
  };

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleActionForDelete = async () => {
    if (selectedCohortId) {
      let cohortDetails = {
        status: Status.ARCHIVED,
      };
      const resp = await updateCohortUpdate(selectedCohortId, cohortDetails);
      console.log(resp);
      if (resp?.responseCode === 200) {
        showToastMessage(t("CENTERS.CENTER_DELETE_SUCCESSFULLY"), "success");
        const cohort = cohortData?.find(
          (item: any) => item.cohortId == selectedCohortId
        );
        if (cohort) {
          cohort.status = Status.ARCHIVED;
        }
        console.log(resp?.params?.successmessage);
      } else {
        console.log("Cohort Not Archived");
      }
      setSelectedCohortId("");
    } else {
      console.log("No Cohort Selected");
      setSelectedCohortId("");
    }
    fetchUserList();
  };

  const handleSortChange = async (event: SelectChangeEvent) => {
    if (cohortData?.length > 0) {
      if (event.target.value === "Z-A") {
        setSortBy(["name", SORT.DESCENDING]);
      } else if (event.target.value === "A-Z") {
        setSortBy(["name", SORT.ASCENDING]);
      } else {
        setSortBy(["createdAt", SORT.ASCENDING]);
      }
      setSelectedSort(event.target.value);
    }
  };

  const handleSearch = (keyword: string) => {
    setPageOffset(Numbers.ZERO);
    setPageCount(Numbers.ONE);
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: keyword,
    }));
  };

  const handleFilterChange = async (
    event: React.SyntheticEvent,
    newValue: any
  ) => {
    setStatusValue(newValue);

    setSelectedFilter(newValue);
    setPageSize(Numbers.TEN);
    setPageLimit(Numbers.TEN);
    setPageOffset(Numbers.ZERO);
    setPageCount(Numbers.ONE);

    if (newValue === Status.ACTIVE) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        status: [Status.ACTIVE],
      }));
    } else if (newValue === Status.ARCHIVED) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        status: [Status.ARCHIVED],
      }));
    } else if (newValue === Status.ALL_LABEL) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        status: "",
      }));
    } else {
      setFilters((prevFilters) => {
        const { status, ...restFilters } = prevFilters;
        return {
          ...restFilters,
        };
      });
    }
  };

  const handleEdit = async (rowData: any) => {
    setLoading(true);
    // Handle edit action here
    // setIsEditModalOpen(true);
    if (rowData) {
      const cohortId = rowData?.cohortId;
      setSelectedCohortId(cohortId);
      const cohortName = rowData?.name;
      setInputName(cohortName);

      let data = {
        filters: {
          cohortId: cohortId,
        },
        limit: Numbers.TWENTY,
        offset: 0,
      };
      const resp = await getCohortList(data);
      const formFields = await getFormRead("cohorts", "cohort");

      const cohortDetails = resp?.results?.cohortDetails?.[0] || {};

      setEditFormData(mapFields(formFields, cohortDetails));
      setLoading(false);
      setIsEditForm(true);
    }
    setLoading(false);
    setConfirmButtonDisable(false);
  };

  const handleDelete = (rowData: any) => {
    setLoading(true);

    const cohortName = rowData?.name;
    // SetDeletedRowData
    setInputName(cohortName);
    setConfirmationModalOpen(true);
    if (rowData) {
      setSelectedRowData(rowData);
      const cohortId = rowData?.cohortId;
      setSelectedCohortId(cohortId);
      setLoading(false);
    }
    setLoading(false);
  };

  // add  extra buttons
  const extraActions: any = [
    { name: t("COMMON.EDIT"), onClick: handleEdit, icon: EditIcon },
    { name: t("COMMON.DELETE"), onClick: handleDelete, icon: DeleteIcon },
  ];

  const onCloseEditMOdel = () => {
    setIsEditModalOpen(false);
  };

  const onCloseEditForm = () => {
    setIsEditForm(false);
  };
  const handleInputName = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedName = event.target.value;
    setInputName(updatedName);
  };

  const handleChangeForm = (event: IChangeEvent<any>) => {
    console.log("Form data changed:", event.formData);
  };
  const handleError = () => {
    console.log("error");
  };

  const handleUpdateAction = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    setLoading(true);
    const formData = data?.formData;
    console.log("formData", formData);
    const schemaProperties = schema.properties;

    let apiBody: any = {
      customFields: [],
    };
    Object.entries(formData).forEach(([fieldKey, fieldValue]) => {
      const fieldSchema = schemaProperties[fieldKey];
      const fieldId = fieldSchema?.fieldId;

      console.log(
        `FieldID: ${fieldId}, FieldValue: ${JSON.stringify(fieldSchema)}, type: ${typeof fieldValue}`
      );

      if (fieldId === null || fieldId === "null") {
        if (typeof fieldValue !== "object") {
          apiBody[fieldKey] = fieldValue;
        }
      } else {
        if (
          fieldSchema?.hasOwnProperty("isDropdown") ||
          fieldSchema?.hasOwnProperty("isCheckbox") ||
          fieldSchema?.type === "radio"
        ) {
          apiBody.customFields.push({
            fieldId: fieldId,
            value: Array.isArray(fieldValue) ? fieldValue : [fieldValue],
          });
        } else {
          if (fieldSchema?.checkbox && fieldSchema.type === "array") {
            if (String(fieldValue).length != 0) {
              apiBody.customFields.push({
                fieldId: fieldId,
                value: String(fieldValue).split(","),
              });
            }
          } else {
            if (fieldId) {
              apiBody.customFields.push({
                fieldId: fieldId,
                value: String(fieldValue),
              });
            }
          }
        }
      }
    });

    const customFields = apiBody?.customFields;
    try {
      setLoading(true);
      setConfirmButtonDisable(true);
      if (!selectedCohortId) {
        console.log("No cohort Id Selected");
        showToastMessage(t("CENTERS.NO_COHORT_ID_SELECTED"), "error");
        return;
      }
      let cohortDetails = {
        name: formData?.name,
        customFields: customFields,
      };
      const resp = await updateCohortUpdate(selectedCohortId, cohortDetails);
      if (resp?.responseCode === 200 || resp?.responseCode === 201) {
        showToastMessage(t("CENTERS.CENTER_UPDATE_SUCCESSFULLY"), "success");
        setLoading(false);
      } else {
        showToastMessage(t("CENTERS.CENTER_UPDATE_FAILED"), "error");
      }
    } catch (error) {
      console.error("Error updating cohort:", error);
      showToastMessage(t("CENTERS.CENTER_UPDATE_FAILED"), "error");
    } finally {
      setLoading(false);
      setConfirmButtonDisable(false);
      onCloseEditMOdel();
      fetchUserList();
      setIsEditForm(false);
    }
  };

  const handleAddUserClick = () => {
    setOpenAddNewCohort(true);
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        const object = {
          // "limit": 20,
          // "offset": 0,
          fieldName: "states",
        };
        // const response = await getStateBlockDistrictList(object);
        // const result = response?.result?.values;
        if (typeof window !== "undefined" && window.localStorage) {
          const admin = localStorage.getItem("adminInfo");
          if (admin) {
            const stateField = JSON.parse(admin).customFields.find(
              (field: any) => field.label === "STATES"
            );
            console.log(stateField.value, stateField.code);
            if (!stateField.value.includes(",")) {
              setSelectedState([stateField.value]);
              setSelectedStateCode(stateField.code);
            }

            const object = [
              {
                value: stateField.code,
                label: stateField.value,
              },
            ];
            // setStates(object);
          }
        }
        //  setStates(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // props to send in header
  const userProps = {
    userType: t("SIDEBAR.CENTERS"),
    searchPlaceHolder: t("CENTERS.SEARCHBAR_PLACEHOLDER"),
    selectedState: selectedState,
    selectedStateCode: selectedStateCode,
    selectedDistrict: selectedDistrict,
    selectedBlock: selectedBlock,
    selectedSort: selectedSort,
    selectedFilter: selectedFilter,
    handleStateChange: handleStateChange,
    handleDistrictChange: handleDistrictChange,
    handleBlockChange: handleBlockChange,
    handleSortChange: handleSortChange,
    handleFilterChange: handleFilterChange,
    handleSearch: handleSearch,
    showAddNew: true,
    handleAddUserClick: handleAddUserClick,
    statusValue: statusValue,
    setStatusValue: setStatusValue,
    showSort: true,
  };

  return (
    <>
      <ConfirmationModal
        message={
          selectedRowData?.totalActiveMembers > 0
            ? t("CENTERS.YOU_CANT_DELETE_CENTER_HAS") +
              ` ${selectedRowData?.totalActiveMembers} ` +
              t("TABLE_TITLE.ACTIVE_MEMBERS")
            : t("CENTERS.SURE_DELETE_CENTER") +
              inputName +
              " " +
              t("CENTERS.CENTER") +
              "?"
        }
        handleAction={handleActionForDelete}
        buttonNames={
          selectedRowData?.totalActiveMembers > 0
            ? { secondary: t("COMMON.CANCEL") }
            : { primary: t("COMMON.YES"), secondary: t("COMMON.CANCEL") }
        }
        handleCloseModal={handleCloseModal}
        modalOpen={confirmationModalOpen}
      />
      <ConfirmationModal
        message={
          t("CENTERS.SURE_DELETE_CENTER") +
          inputName +
          " " +
          t("CENTERS.CENTER") +
          "?"
        }
        handleAction={handleActionForDelete}
        buttonNames={{
          // primary: t("COMMON.YES"),
          secondary: t("COMMON.CANCEL"),
        }}
        handleCloseModal={handleCloseModal}
        modalOpen={confirmationModalOpenForActive}
      />
      <HeaderComponent {...userProps}>
        {loading ? (
          <Box
            width={"100%"}
            id="check"
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <Loader showBackdrop={false} loadingText={t("COMMON.LOADING")} />
          </Box>
        ) : cohortData?.length > 0 ? (
          <KaTableComponent
            columns={getCenterTableData(t, isMobile)}
            data={cohortData}
            limit={pageLimit}
            offset={pageOffset}
            paginationEnable={totalCount > Numbers.TEN}
            PagesSelector={PagesSelector}
            pagination={pagination}
            PageSizeSelector={PageSizeSelectorFunction}
            pageSizes={pageSizeArray}
            extraActions={extraActions}
            showIcons={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="20vh"
          >
            <Typography marginTop="10px" textAlign={"center"}>
              {t("COMMON.NO_CENTER_FOUND")}
            </Typography>
          </Box>
        )}

        <AddNewCenters
          open={openAddNewCohort}
          onClose={handleCloseAddLearnerModal}
          formData={formdata}
          isEditModal={true}
          userId={userId}
        />

        <SimpleModal
          open={isEditForm}
          onClose={onCloseEditForm}
          showFooter={false}
          modalTitle={t("COMMON.UPDATE_CENTER")}
        >
          {schema && uiSchema && (
            <DynamicForm
              schema={schema}
              uiSchema={uiSchema}
              onSubmit={handleUpdateAction}
              onChange={handleChangeForm}
              onError={handleError}
              widgets={{}}
              showErrorList={true}
              customFields={customFields}
              formData={editFormData}
              id="update-center-form"
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "right", // Centers the button horizontally
                  marginTop: "20px", // Adjust margin as needed
                }}
                gap={2}
              >
                <Button
                  variant="outlined"
                  type="submit"
                  form="update-center-form" // Add this line
                  sx={{
                    fontSize: "14px",
                    fontWeight: "500",
                    width: "auto",
                    height: "40px",
                    marginLeft: "10px",
                  }}
                  onClick={onCloseEditForm}
                >
                  {t("COMMON.CANCEL")}
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  form="update-center-form" // Add this line
                  sx={{
                    fontSize: "14px",
                    fontWeight: "500",
                    width: "auto",
                    height: "40px",
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    setSubmittedButtonStatus(true);
                    console.log("update button was clicked");
                  }}
                >
                  {t("COMMON.UPDATE")}
                </Button>
              </Box>
            </DynamicForm>
          )}
        </SimpleModal>
      </HeaderComponent>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Center;
