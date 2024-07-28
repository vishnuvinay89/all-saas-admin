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
  getCohortList,
  updateCohortUpdate,
} from "@/services/CohortService/cohortService";
import { Role, Storage } from "@/utils/app.constant";
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

type UserDetails = {
  userId: any;
  username: any;
  name: any;
  role: any;
  mobile: any;
  centers?: any;
  Programs?: any;
};

const Cohorts: React.FC = () => {
  // use hooks
  const { t } = useTranslation();

  // colums in table
  const columns = [
    {
      key: "cohortName",
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
      key: "createdDate",
      title: t("TABLE_TITLE.CREATED_DATE"),
      dataType: DataType.String,
    },
    {
      key: "updatedDate",
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
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [cohortData, setCohortData] = useState<UserDetails[]>([]);
  const [pageSize, setPageSize] = React.useState<string | number>("");
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
  // use api calls
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const userId = localStorage.getItem(Storage.USER_ID) || "";
      setUserId(userId);
    }
  }, []);

  // const { data, error, isLoading } = useCohortList(userId);
  // useEffect(() => {
  //   if (data) {
  //     setCohortData(data);
  //   }
  // }, [data]);

  const fetchUserList = async () => {
    try {
      const limit = pageLimit;
      // const page = 0;
      const offset = pageOffset;
      // const sort = ["createdAt", "asc"];
      const filters = { role: Role.TEACHER };
      const userId = localStorage.getItem(Storage.USER_ID) || "";

      const resp = await getCohortList(userId);
      const result = resp;
      console.log("result", result);

      setCohortData(result);
    } catch (error) {
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
  }, [pageOffset, pageLimit]);

  // handle functions
  const handleChange = (event: SelectChangeEvent<typeof pageSize>) => {
    setPageSize(event.target.value);
    setPageLimit(Number(event.target.value));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const PagesSelector = () => (
    <>
      <Pagination
        color="primary"
        count={100}
        page={pageOffset + 1}
        onChange={handlePaginationChange}
      />
    </>
  );
  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageOffset(value - 1);
  };

  const PageSizeSelectorFunction = ({}) => (
    <>
      <PageSizeSelector handleChange={handleChange} pageSize={pageSize} />
    </>
  );

  const handleStateChange = (selected: string[]) => {
    setSelectedState(selected);
    console.log("Selected categories:", selected);
  };
  const handleDistrictChange = (selected: string[]) => {
    setSelectedDistrict(selected);
    console.log("Selected categories:", selected);
  };
  const handleBlockChange = (selected: string[]) => {
    setSelectedBlock(selected);
    console.log("Selected categories:", selected);
  };

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
  };

  const handleActionForDelete = async () => {
    if (selectedCohortId) {
      let cohortDetails = {
        status: "active",
      };
      const resp = await updateCohortUpdate(selectedCohortId, cohortDetails);
      console.log("resp:", resp);
    } else {
    }
  };

  const handleSortChange = async (event: SelectChangeEvent) => {
    //console.log(event.target.value)
    try {
      const limit = pageLimit;
      const offset = pageOffset;
      let sort;
      switch (event.target.value) {
        case "Z-A":
          sort = ["name", "desc"];
          break;
        case "A-Z":
          sort = ["name", "asc"];
          break;
        default:
          sort = ["createdAt", "asc"];
          break;
      }

      const userId = localStorage.getItem(Storage.USER_ID) || "";
      const filters = { role: Role.TEACHER };
      const resp = await getCohortList(userId);
      const result = resp?.cohortData;

      setCohortData(result);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
    setSelectedSort(event.target.value as string);
  };

  const handleFilterChange = async (event: SelectChangeEvent) => {
    console.log(event.target.value as string);
    setSelectedFilter(event.target.value as string);
  };

  const handleEdit = (rowData: any) => {
    setLoading(true);
    // Handle edit action here
    setIsEditModalOpen(true);
    if (rowData) {
      const cohortId = rowData?.cohortId;
      setSelectedCohortId(cohortId);
      const cohortName = rowData?.cohortName;
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
    handleActionForDelete();
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
    } else {
      setLoading(false);
      console.log("No cohort Id Selected");
    }
    onCloseEditMOdel();
    fetchUserList();
    setLoading(false);
  };

  const handleSearch = (keyword: string) => {};

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
    const target = event.target as HTMLFormElement;
    const elementsArray = Array.from(target.elements);

    console.log("elementsArray", elementsArray);
    console.log("target", target);
    console.log("Form data submitted:", data.formData);
  };

  const handleError = () => {
    console.log("error");
  };

  // props to send in header
  const userProps = {
    userType: t("SIDEBAR.COHORTS"),
    searchPlaceHolder: t("COHORTS.SEARCHBAR_PLACEHOLDER"),
    selectedState: selectedState,
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
        title={t("COMMON.EDIT_COHORT_NAME")}
        // subtitle={t("COMMON.NAME")}
        primaryBtnText={t("COMMON.UPDATE_COHORT")}
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
        message={t("CENTERS.REQUEST_TO_DELETE")}
        handleAction={handleActionForDelete}
        buttonNames={{
          primary: t("COMMON.YES"),
          secondary: t("COMMON.NO_GO_BACK"),
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
            paginationEnable={false}
            PagesSelector={PagesSelector}
            PageSizeSelector={PageSizeSelectorFunction}
            extraActions={extraActions}
            showIcons={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <Box display="flex">
            <Typography marginTop="10px" textAlign={"center"}>
              {t("COMMON.NO_USER_FOUND")}
            </Typography>
          </Box>
        )}
      </HeaderComponent>
      <SimpleModal
        open={openAddNewCohort}
        onClose={onCloseAddNewCohort}
        showFooter={false}
        modalTitle={"New Cohort"}
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

export default Cohorts;
