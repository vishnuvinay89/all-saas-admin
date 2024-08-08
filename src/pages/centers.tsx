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
  getCohortList,
  updateCohortUpdate,
} from "@/services/CohortService/cohortService";
import { Numbers, SORT, Status, Storage } from "@/utils/app.constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "@/components/ConfirmationModal";
import CustomModal from "@/components/CustomModal";
import { Box, TextField, Typography, useMediaQuery } from "@mui/material";
import Loader from "@/components/Loader";
import { getFormRead } from "@/services/CreateUserService";
import { GenerateSchemaAndUiSchema } from "@/components/GeneratedSchemas";
import { CustomField } from "@/utils/Interfaces";
import { showToastMessage } from "@/components/Toastify";
import AddNewCenters from "@/components/AddNewCenters";
import { getCenterTableData } from "@/data/tableColumns";
import { Theme } from "@mui/system";
import {  firstLetterInUpperCase } from "@/utils/Helper";

type cohortFilterDetails = {
  type?: string;
  status?: any;
  states?: string;
  districts?: string;
  blocks?: string;
  name?:string
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

  // handle states
  const [selectedState, setSelectedState] = React.useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = React.useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = React.useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [cohortData, setCohortData] = useState<cohortFilterDetails[]>([]);
  const [pageSize, setPageSize] = React.useState<string | number>("10");
  const [confirmationModalOpen, setConfirmationModalOpen] =
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
  const [formdata, setFormData] = useState<any>();
  const [totalCount,setTotalCound] = useState<number>(0)
  const handleCloseAddLearnerModal = () => {
    setOpenAddNewCohort(false);
  };
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  );
  // use api calls
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const userId = localStorage.getItem(Storage.USER_ID) || "";
      setUserId(userId);
    }

    // get form data for center create
    getAddCenterFormData();
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
        const resultData:centerData[] = []
        result?.forEach((item:any)=>{
          const cohortType = item?.customFields?.map((field:any) => firstLetterInUpperCase(field?.value))
          const requiredData = {
            name:item?.name,
            status:item?.status,
            updatedBy: item?.updatedBy,
            createdBy: item?.createdBy,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt,
            customFieldValues:cohortType || ""
          }
          resultData?.push(requiredData)
        })
        setCohortData(resultData);
        const totalCount = resp?.count;
        setTotalCound(totalCount)
        if (totalCount >= 20) {
          setPageSizeArray([5, 10, 15,20]);
        }else if (totalCount >= 15) {
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
  }, [pageOffset, pageLimit, sortBy, filters]);

  // handle functions
  const handleChange = (event: SelectChangeEvent<typeof pageSize>) => {
    setPageSize(event.target.value);
    setPageLimit(Number(event.target.value));
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
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
          status: filters.status,
          states: selectedStateCode,
          districts: districts,
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
          status: filters.status,
          states: selectedStateCode,
          districts: selectedDistrictCode,
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
          status: filters.status,
          states: selectedStateCode,
          districts: selectedDistrictCode,
          blocks: blocks,
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
          (item: any) => item.cohortId == selectedCohortId,
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
  };

  const handleSortChange = async (event: SelectChangeEvent) => {
    if (event.target.value === "Z-A") {
      setSortBy(["name", SORT.DESCENDING]);
    } else if (event.target.value === "A-Z") {
      setSortBy(["name", SORT.ASCENDING]);
    } else {
      setSortBy(["createdAt", SORT.ASCENDING]);
    }
    setSelectedSort(event.target.value);
  };

  const handleSearch = (keyword: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: keyword,
    }));
  };

  const handleFilterChange = async (event: SelectChangeEvent) => {
    setSelectedFilter(event.target.value);

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
    { name: t("COMMON.EDIT"), onClick: handleEdit, icon: EditIcon },
    { name: t("COMMON.DELETE"), onClick: handleDelete, icon: DeleteIcon },
  ];

  const onCloseEditMOdel = () => {
    setIsEditModalOpen(false);
  };

  const handleInputName = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedName = event.target.value;
    setInputName(updatedName);
  };

  const handleUpdateAction = async () => {
    try {
      setLoading(true);
      setConfirmButtonDisable(true);

      if (!selectedCohortId) {
        setLoading(false);
        console.log("No cohort Id Selected");
        showToastMessage(t("CENTERS.NO_COHORT_ID_SELECTED"), "error");
        return;
      }

      let cohortDetails = {
        name: inputName,
      };

      const resp = await updateCohortUpdate(selectedCohortId, cohortDetails);
      console.log("resp:", resp);

      showToastMessage(t("CENTERS.CENTER_UPDATE_SUCCESSFULLY"), "success");
    } catch (error) {
      console.error("Error updating cohort:", error);
      showToastMessage(t("CENTERS.CENTER_UPDATE_FAILED"), "error");
    } finally {
      setLoading(false);
      setConfirmButtonDisable(false);
      onCloseEditMOdel();
      fetchUserList();
    }
  };

  const handleAddUserClick = () => {
    setOpenAddNewCohort(true);
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
            columns={getCenterTableData(t, isMobile)}
            data={cohortData}
            limit={pageLimit}
            offset={pageOffset}
            paginationEnable={totalCount > 5 }
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

        <AddNewCenters
          open={openAddNewCohort}
          onClose={handleCloseAddLearnerModal}
          formData={formdata}
          isEditModal={true}
          userId={userId}
        />
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
