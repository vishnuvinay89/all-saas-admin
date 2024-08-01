import React, { ChangeEvent, FormEvent } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useEffect } from "react";
import HeaderComponent from "@/components/HeaderComponent";
import { useTranslation } from "next-i18next";
import Pagination from "@mui/material/Pagination";
import { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import {
  createCohort,
  getCohortList,
  updateCohortUpdate,
} from "@/services/CohortService/cohortService";
import { Numbers, Role, SORT, Status, Storage } from "@/utils/app.constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "@/components/ConfirmationModal";
import CustomModal from "@/components/CustomModal";
import { Box, TextField, Typography } from "@mui/material";
import { SortDirection } from "ka-table/enums";
import Loader from "@/components/Loader";
import Image from "next/image";
import glass from "../../public/images/empty_hourglass.svg";
import { useCohortList } from "@/services/CohortService/cohortListHook";
import { getFormRead } from "@/services/CreateUserService";
import {
  GenerateSchemaAndUiSchema,
  customFields,
} from "@/components/GeneratedSchemas";
import SimpleModal from "@/components/SimpleModal";
import DynamicForm from "@/components/DynamicForm";
import { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import { CustomField } from "@/utils/Interfaces";
import { showToastMessage } from "@/components/Toastify";

type cohortFilterDetails = {
  type?: string;
  status?: any;
  states?: string;
  districts?: string;
  blocks?: string;
};
type UserDetails = {
  userId: any;
  username: any;
  name: any;
  role: any;
  mobile: any;
  centers?: any;
  Programs?: any;
};

interface CohortDetails {
  name?: string;
  type?: string;
  parentId?: string | null;
  customFields?: CustomField[];
}

const Center: React.FC = () => {
  // use hooks
  const { t } = useTranslation();

  // colums in table
  const columns = [
    {
      key: "name",
      title: t("TABLE_TITLE.NAME"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
    },
    {
      key: "status",
      title: t("TABLE_TITLE.STATUS"),
      dataType: DataType.String,
    },
    {
      key: "createdAt",
      title: t("TABLE_TITLE.CREATED_DATE"),
      dataType: DataType.String,
    },
    {
      key: "updatedAt",
      title: t("TABLE_TITLE.UPDATED_DATE"),
      dataType: DataType.String,
    },
    {
      key: "createdBy",
      title: t("TABLE_TITLE.CREATED_BY"),
      dataType: DataType.String,
    },
    {
      key: "updatedBy",
      title: t("TABLE_TITLE.UPDATED_BY"),
      dataType: DataType.String,
    },

    {
      key: "actions",
      title: t("TABLE_TITLE.ACTIONS"),
      dataType: DataType.String,
    },
  ];

  // handle states
  const [selectedState, setSelectedState] = React.useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = React.useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = React.useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [cohortData, setCohortData] = useState<cohortFilterDetails[]>([]);
  const [pageSize, setPageSize] = React.useState<string | number>("10");
  const [open, setOpen] = React.useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState<boolean>(false);
  const [selectedCohortId, setSelectedCohortId] = React.useState<string>("");
  const [editModelOpen, setIsEditModalOpen] = React.useState<boolean>(false);
  const [confirmButtonDisable, setConfirmButtonDisable] =
    React.useState<boolean>(false);
  const [inputName, setInputName] = React.useState<string>("");
  const [cohortName, setCohortName] = React.useState<string>("");
  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = React.useState<string[]>([]);
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [openAddNewCohort, setOpenAddNewCohort] =
    React.useState<boolean>(false);

  const [pageCount, setPageCount] = useState(Numbers.ONE);
  const [pageOffset, setPageOffset] = useState(Numbers.ZERO);
  const [pageLimit, setPageLimit] = useState(Numbers.TEN);
  const [pageSizeArray, setPageSizeArray] = React.useState<number[]>([]);
  const [filters, setFilters] = useState<cohortFilterDetails>({
    type: "COHORT",
  });
  const [sortBy, setSortBy] = useState(["createdAt", "asc"]);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedBlockCode, setSelectedBlockCode] = useState("");
  // use api calls
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const userId = localStorage.getItem(Storage.USER_ID) || "";
      setUserId(userId);
    }
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
        setCohortData(result);
        const totalCount = resp?.count;
        if (totalCount >= 15) {
          setPageSizeArray([5, 10, 15]);
        } else if (totalCount >= 10) {
          setPageSizeArray([5, 10]);
        } else if (totalCount >= 5 || totalCount < 5) {
          setPageSizeArray([5]);
        }

        const pageCount = Math.ceil(totalCount / pageLimit);
        setPageCount(pageCount);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching user list:", error);
    }
  };

  const getFormData = async () => {
    const res = await getFormRead("cohorts", "cohort");

    const formDatas = res?.fields;
    console.log("formDatas", formDatas);
    setFormData(formDatas);
  };

  useEffect(() => {
    const getAddLearnerFormData = async () => {
      try {
        const response = await getFormRead("cohorts", "cohort");
        console.log("sortedFields", response);

        if (response) {
          const { schema, uiSchema } = GenerateSchemaAndUiSchema(response, t);
          console.log("schema", schema);
          console.log("uiSchema", uiSchema);
          setSchema(schema);
          setUiSchema(uiSchema);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    getAddLearnerFormData();
  }, []);

  useEffect(() => {
    fetchUserList();
    getFormData();
  }, [pageOffset, pageLimit, sortBy, filters]);

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
    <Box mt={3}>
      <Pagination
        color="primary"
        count={pageCount}
        page={pageOffset + 1}
        onChange={handlePaginationChange}
      />
    </Box>
  );

  const PageSizeSelectorFunction = ({}) => (
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
      if (filters.status) setFilters({ status: filters.status });
      // else setFilters({ role: role });
    } else {
      const stateCodes = code?.join(",");
      console.log("stateCodes", stateCodes);
      setSelectedStateCode(stateCodes);
      if (filters.status)
        setFilters({ status: filters.status, states: stateCodes });
      else setFilters({ states: stateCodes });
    }

    console.log("Selected categories:", typeof code[0]);
  };

  const handleDistrictChange = (selected: string[], code: string[]) => {
    setSelectedBlock([]);
    setSelectedDistrict(selected);

    if (selected[0] === "") {
      if (filters.status) {
        setFilters({
          status: filters.status,
          states: selectedStateCode,

          // role: role,
        });
      } else {
        setFilters({
          states: selectedStateCode,
          // role: role,
        });
      }
    } else {
      const districts = code?.join(",");
      setSelectedDistrictCode(districts);
      if (filters.status) {
        setFilters({
          status: filters.status,
          states: selectedStateCode,
          districts: districts,

          // role: role,
        });
      } else {
        setFilters({
          states: selectedStateCode,
          districts: districts,
          // role: role,
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
          status: filters.status,
          states: selectedStateCode,
          districts: selectedDistrictCode,
          // role: role,
        });
      } else {
        setFilters({
          states: selectedStateCode,
          districts: selectedDistrictCode,
          // role: role,
        });
      }
    } else {
      const blocks = code?.join(",");
      setSelectedBlockCode(blocks);
      if (filters.status) {
        setFilters({
          status: filters.status,
          states: selectedStateCode,
          districts: selectedDistrictCode,
          blocks: blocks,
          // role: role,
        });
      } else {
        setFilters({
          states: selectedStateCode,
          districts: selectedDistrictCode,
          blocks: blocks,
          // role: role,
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
        // setCohortData(updatedCohorts);
        console.log(resp?.params?.successmessage);

        // fetchUserList();
      } else {
        console.log("Cohort Not Archived");
      }
      setSelectedCohortId("");
    } else {
      console.log("No Cohort Selected");
      setSelectedCohortId("");
    }
  };

  const handleSortChange = async (event: SelectChangeEvent) => {
    if (event.target.value === "Z-A") {
      setSortBy(["name", SORT.DESCENDING]);
    } else if (event.target.value === "A-Z") {
      setSortBy(["name", SORT.ASCENDING]);
    } else {
      setSortBy(["createdAt", SORT.ASCENDING]);
    }
    setSelectedSort(event.target.value as string);
  };

  const handleSearch = (keyword: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: keyword,
    }));
  };

  const handleFilterChange = async (event: SelectChangeEvent) => {
    console.log(event.target.value as string);
    setSelectedFilter(event.target.value as string);

    if (event.target.value === Status.ACTIVE_LABEL) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        status: [Status.ACTIVE],
      }));
    } else if (event.target.value === Status.ARCHIVED_LABEL) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        status: [Status.ARCHIVED],
      }));
    } else if (event.target.value === Status.ALL_LABEL) {
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
    // console.log(filters);
  };

  const handleEdit = (rowData: any) => {
    setLoading(true);
    // Handle edit action here
    setIsEditModalOpen(true);
    if (rowData) {
      const cohortId = rowData?.cohortId;
      setSelectedCohortId(cohortId);
      const cohortName = rowData?.name;
      setInputName(cohortName);
      setLoading(false);
    }
    setLoading(false);
    setConfirmButtonDisable(false);
  };

  const handleDelete = (rowData: any) => {
    setLoading(true);
    setConfirmationModalOpen(true);
    if (rowData) {
      const cohortId = rowData?.cohortId;
      setSelectedCohortId(cohortId);
      setLoading(false);
    }
    setLoading(false);
  };

  // add  extra buttons
  const extraActions: any = [
    { name: "Edit", onClick: handleEdit, icon: EditIcon },
    { name: "Delete", onClick: handleDelete, icon: DeleteIcon },
  ];

  const onCloseEditMOdel = () => {
    setIsEditModalOpen(false);
  };

  const handleInputName = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedName = event.target.value;
    setInputName(updatedName);
  };

  const handleUpdateAction = async () => {
    setLoading(true);
    setConfirmButtonDisable(true);
    if (selectedCohortId) {
      let cohortDetails = {
        name: inputName,
      };
      const resp = await updateCohortUpdate(selectedCohortId, cohortDetails);
      setLoading(false);
      console.log("resp:", resp);
      showToastMessage(t("CENTERS.CENTER_UPDATE_SUCCESSFULLY"), "success");
    } else {
      setLoading(false);
      console.log("No cohort Id Selected");
    }
    onCloseEditMOdel();
    fetchUserList();
    setLoading(false);
  };

  const onCloseAddNewCohort = () => {
    setOpenAddNewCohort(false);
  };

  const handleAddUserClick = () => {
    setOpenAddNewCohort(true);
  };

  const handleChangeForm = (event: IChangeEvent<any>) => {
    console.log("Form data changed:", event.formData);
    // setFormData({
    //   ...formData,
    //   [event.target.name]: event.target.value
    // });
  };

  const handleSubmit = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    const formData = data.formData;

    const parentId = localStorage.getItem("blockParentId") || "";
    const cohortDetails: CohortDetails = {
      name: formData.name,
      type: "COHORT",
      parentId: parentId,
      customFields: [],
    };

    Object.entries(formData).forEach(([fieldKey, fieldValue]) => {
      const fieldSchema = schema.properties[fieldKey];
      const fieldId = fieldSchema?.fieldId;
      if (fieldId !== null) {
        cohortDetails?.customFields?.push({
          fieldId: fieldId,
          value: formData.cohort_type,
        });
      }
    });
    console.log("cohortDetails");
    if (
      cohortDetails?.customFields &&
      cohortDetails?.customFields?.length > 0 &&
      cohortDetails?.name
    ) {
      const cohortData = await createCohort(cohortDetails);
      if (cohortData) {
        showToastMessage(t("CENTERS.CENTER_CREATED_SUCCESSFULLY"), "success");
        setOpenAddNewCohort(false);
        fetchUserList();
      }
    } else {
      showToastMessage("Please Input Data", "warning");
    }
  };

  const handleError = () => {
    console.log("error");
  };

  // props to send in header
  const userProps = {
    userType: t("SIDEBAR.CENTER"),
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
  };
  return (
    <>
      <CustomModal
        open={editModelOpen}
        handleClose={onCloseEditMOdel}
        title={t("COMMON.EDIT_CENTER_NAME")}
        // subtitle={t("COMMON.NAME")}
        primaryBtnText={t("COMMON.UPDATE_CENTER")}
        secondaryBtnText="Cancel"
        primaryBtnClick={handleUpdateAction}
        primaryBtnDisabled={confirmButtonDisable}
        secondaryBtnClick={onCloseEditMOdel}
      >
        <Box>
          <TextField
            id="standard-basic"
            label="Cohort Name"
            variant="standard"
            value={inputName}
            onChange={handleInputName}
          />
        </Box>
      </CustomModal>
      <ConfirmationModal
        message={t("CENTERS.SURE_DELETE_CENTER")}
        handleAction={handleActionForDelete}
        buttonNames={{
          primary: t("COMMON.YES"),
          secondary: t("COMMON.CANCEL"),
        }}
        handleCloseModal={handleCloseModal}
        modalOpen={confirmationModalOpen}
      />
      <HeaderComponent {...userProps}>
        {loading ? (
          <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />
        ) : cohortData?.length > 0 ? (
          <KaTableComponent
            columns={columns}
            data={cohortData}
            limit={pageLimit}
            offset={pageOffset}
            paginationEnable={true}
            PagesSelector={PagesSelector}
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
      </HeaderComponent>
      <SimpleModal
        open={openAddNewCohort}
        onClose={onCloseAddNewCohort}
        showFooter={false}
        modalTitle={t("CENTERS.NEW_CENTER")}
      >
        {schema && uiSchema && (
          <DynamicForm
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={handleSubmit}
            onChange={handleChangeForm}
            onError={handleError}
            widgets={{}}
            showErrorList={true}
            customFields={customFields}
          ></DynamicForm>
        )}
      </SimpleModal>
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
