import DeleteUserModal from "@/components/DeleteUserModal";
import HeaderComponent from "@/components/HeaderComponent";
import PageSizeSelector from "@/components/PageSelector";
import { FormContextType, SORT, Status } from "@/utils/app.constant";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { DataType, SortDirection } from "ka-table/enums";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import KaTableComponent from "./KaTableComponent";
import Loader from "./Loader";
import { userList } from "../services/UserList";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { Role, apiCatchingDuration } from "@/utils/app.constant";
import { getFormRead, updateUser } from "@/services/CreateUserService";
import { showToastMessage } from "./Toastify";
import {
  capitalizeFirstLetterOfEachWordInArray,
  firstLetterInUpperCase,
} from "../utils/Helper";
import { getTLTableColumns } from "@/data/tableColumns";
import { Button, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/system";
import CommonUserModal from "./CommonUserModal";
import { useQuery } from "@tanstack/react-query";
import ReassignCenterModal from "./ReassignCenterModal";
import {
  deleteUser,
  getCohortList,
  getTenantLists,
  rolesList,
  updateCohortMemberStatus,
  updateCohortUpdate,
} from "@/services/CohortService/cohortService";
import useSubmittedButtonStore from "@/utils/useSharedState";
import { useRouter } from "next/router";
import SimpleModal from "./SimpleModal";
import userJsonSchema from "./UserUpdateSchema.json";
import DynamicForm from "@/components/DynamicForm";
import { IChangeEvent } from "@rjsf/core";
import { RJSFSchema } from "@rjsf/utils";
import { customFields } from "./GeneratedSchemas";
import { tenantId } from "../../app.config";
import ConfirmationModal from "./ConfirmationModal";

type UserDetails = {
  userId: any;
  username: any;
  name: any;
  role: any;
  mobile: any;
  centers?: any;
  Programs?: any;
  age?: any;
  state?: any;
  district?: any;
  blocks?: any;
  stateCode?: any;
  districtCode?: any;
  blockCode?: any;
  centerMembershipIdList?: any;
  blockMembershipIdList?: any;
  cohortIds?: any;
  districtValue?: any;
  mobileNo: string;
  email: string;
  status: string;
};
type UserDetailParam = {
  // Expected properties of UserDetailParam
  id: string;
  role: string;
  status: string;
};

type FilterDetails = {
  role: any;
  status?: any;
  districts?: any;
  states?: any;
  blocks?: any;
  name?: any;
  cohortId?: any;
  tenantId?: any;
};
interface CenterProp {
  cohortId: string;
  name: string;
}
interface Cohort {
  cohortId: string;
  name: string;
  parentId: string | null;
  type: string;
  customField: any[];
  cohortMemberStatus?: string;
  cohortMembershipId?: string;
}
interface UserTableProps {
  role: string;
  userType: string;
  searchPlaceholder: string;
  handleAddUserClick: any;
  parentState?: boolean;
}
interface FieldProp {
  value: string;
  label: string;
}

const UserTable: React.FC<UserTableProps> = ({
  role,
  userType,
  searchPlaceholder,
  handleAddUserClick,
  parentState,
}) => {
  const [selectedState, setSelectedState] = React.useState<string[]>([]);
  const [blockMembershipIdList, setBlockMembershipIdList] = React.useState<
    string[]
  >([]);
  const [centerMembershipIdList, setCenterMembershipIdList] = React.useState<
    string[]
  >([]);
  const router = useRouter();

  const selectedBlockStore = useSubmittedButtonStore(
    (state: any) => state.selectedBlockStore
  );
  const setSelectedBlockStore = useSubmittedButtonStore(
    (state: any) => state.setSelectedBlockStore
  );
  const selectedDistrictStore = useSubmittedButtonStore(
    (state: any) => state.selectedDistrictStore
  );
  const setSelectedDistrictStore = useSubmittedButtonStore(
    (state: any) => state.setSelectedDistrictStore
  );
  const selectedCenterStore = useSubmittedButtonStore(
    (state: any) => state.selectedCenterStore
  );
  const setSelectedCenterStore = useSubmittedButtonStore(
    (state: any) => state.setSelectedCenterStore
  );
  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );

  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState<string[]>([]);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedBlock, setSelectedBlock] = React.useState<string[]>([]);
  const [selectedBlockCode, setSelectedBlockCode] = useState("");
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [pageSizeArray, setPageSizeArray] = React.useState<number[]>([]);
  const [data, setData] = useState<UserDetails[]>([]);
  const [cohortsFetched, setCohortsFetched] = useState(false);
  const { t } = useTranslation();
  const [pageSize, setPageSize] = React.useState<string | number>("10");
  const [sortBy, setSortBy] = useState(["createdAt", "asc"]);
  const [sortByForCohortMemberList, setsortByForCohortMemberList] = useState([
    "name",
    SORT.ASCENDING,
  ]);
  const [statusValue, setStatusValue] = useState(Status.ACTIVE);
  const [pageCount, setPageCount] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReassignCohortModalOpen, setIsReassignCohortModalOpen] =
    useState(false);
  const [centers, setCenters] = useState<CenterProp[]>([]);
  const [blocks, setBlocks] = useState<FieldProp[]>([]);
  const [userCohort, setUserCohorts] = useState("");
  const [assignedCenters, setAssignedCenters] = useState<any>();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [cohortId, setCohortId] = useState([]);
  const [block, setBlock] = useState("");
  const [district, setDistrict] = useState("");
  const [blockCode, setBlockCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [deleteUserState, setDeleteUserState] = useState(false);
  const [editUserState, setEditUserState] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<string[]>([]);
  const [selectedCenterCode, setSelectedCenterCode] = useState<string[]>([]);
  const [schema, setSchema] = React.useState(userJsonSchema);
  const [listOfCohorts, setListOfCohorts] = useState<any>([]);
  const [updateBtnDisabled, setUpdateBtnDisabled] = React.useState(true);
  const [listOfTenants, setListOfTenants] = useState<any>([]);
  const [selectedTenant, setSelectedTenant] = React.useState<string[]>([]);
  const [selectedCohort, setSelectedCohort] = React.useState<string[]>([]);
  const isMobile: boolean = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const [confirmButtonDisable, setConfirmButtonDisable] = useState(true);
  const [pagination, setPagination] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [formData, setFormData] = useState<any>();

  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [openAddLearnerModal, setOpenAddLearnerModal] = React.useState(false);
  const [userId, setUserId] = useState();
  const [submitValue, setSubmitValue] = useState<boolean>(false);
  const [isEditForm, setIsEditForm] = useState<boolean>(false);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState<boolean>(false);
  const [selectedRowData, setSelectedRowData] = useState<any>("");

  const uiSchema = {
    name: {
      "ui:widget": "text",
      "ui:placeholder": "Enter your full name",
      "ui:help": "Full name, only letters and spaces are allowed.",
    },
    username: {
      "ui:widget": "text",
      "ui:placeholder": "Enter your username",
    },
    // password: {
    //   "ui:widget": "password",
    //   "ui:placeholder": "Enter a secure password",
    //   "ui:help":
    //     "Password must be at least 8 characters long, with at least one letter and one number.",
    // },
    role: {
      "ui:widget": "select",
      "ui:placeholder": "Select a role",
    },
    mobileNo: {
      "ui:widget": "text",
      "ui:placeholder": "Enter your 10-digit mobile number",
      // "ui:help": "Please enter a valid 10-digit mobile number.",
    },
    email: {
      "ui:widget": "text",
      "ui:placeholder": "Enter your email address",
      "ui:options": {},
    },
  };
  const reassignButtonStatus = useSubmittedButtonStore(
    (state: any) => state.reassignButtonStatus
  );
  const {
    data: teacherFormData,
    isLoading: teacherFormDataLoading,
    error: teacherFormDataErrror,
  } = useQuery<any[]>({
    queryKey: ["teacherFormData"],
    queryFn: () => Promise.resolve([]),
    staleTime: apiCatchingDuration.GETREADFORM,
    enabled: false,
  });
  const {
    data: studentFormData,
    isLoading: studentFormDataLoading,
    error: studentFormDataErrror,
  } = useQuery<any[]>({
    queryKey: ["studentFormData"],
    queryFn: () => Promise.resolve([]),
    staleTime: apiCatchingDuration.GETREADFORM,
    enabled: false,
  });
  const {
    data: teamLeaderFormData,
    isLoading: teamLeaderFormDataLoading,
    error: teamLeaderFormDataErrror,
  } = useQuery<any[]>({
    queryKey: ["teamLeaderFormData"],
    queryFn: () => Promise.resolve([]),
    staleTime: apiCatchingDuration.GETREADFORM,
    enabled: false,
  });
  const handleOpenAddLearnerModal = () => {
    setIsEditForm(true);
  };
  const onCloseEditForm = () => {
    setIsEditForm(false);
    // setFormData({});
  };
  const handleModalSubmit = (value: boolean) => {
    submitValue ? setSubmitValue(false) : setSubmitValue(true);
  };
  const handleCloseAddLearnerModal = () => {
    setOpenAddLearnerModal(false);
    setUpdateBtnDisabled(true);
  };
  const [filters, setFilters] = useState<FilterDetails>({
    role: "learner",
    status: [statusValue],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTenantLists(filters);
        setListOfTenants(result);
        let data = {
          limit: 0,
          offset: 0,
          filters: {
            tenantId: result?.[0]?.tenantId,
            // cohortId: cohortId,
          },
        };
        if (filters?.tenantId) {
          const cohortList = await getCohortList(data);
          setListOfCohorts(cohortList?.results);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (filters) {
      fetchData();
    }
  }, [filters]);

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
    <>
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
    </>
  );

  const PageSizeSelectorFunction = () => (
    <PageSizeSelector
      handleChange={handleChange}
      pageSize={pageSize}
      options={pageSizeArray}
    />
  );
  const handleStateChange = async (selected: string[], code: string[]) => {
    const newQuery = { ...router.query };

    if (newQuery.center) {
      delete newQuery.center;
    }
    if (newQuery.district) {
      delete newQuery.district;
    }
    if (newQuery.block) {
      delete newQuery.block;
    }
    router.replace({
      pathname: router.pathname,
      query: {
        ...newQuery,
        state: code?.join(","),
      },
    });
    setSelectedCenterCode([]);

    // setEnableCenterFilter(false);
    setSelectedDistrict([]);
    setSelectedCenter([]);

    setSelectedBlock([]);
    setSelectedBlockCode("");
    setSelectedDistrictCode("");
    setSelectedState(selected);

    if (selected[0] === "" || selected[0] === t("COMMON.ALL_STATES")) {
      if (filters.status)
        setFilters({
          status: [filters.status],
          role: "learner",
        });
      // else setFilters({ role: role });
      else setFilters({});
    } else {
      const stateCodes = code?.join(",");
      setSelectedStateCode(stateCodes);
      if (filters.status)
        setFilters({
          states: stateCodes,
          role: "learner",
          status: filters.status,
        });
      else
        setFilters({
          states: stateCodes,
          role: "learner",
        });
    }
  };
  const handleFilterChange = async (
    event: React.SyntheticEvent,
    newValue: any
  ) => {
    setStatusValue(newValue);
    setSelectedFilter(newValue);
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
    } else {
      setFilters((prevFilters) => {
        const { status, ...restFilters } = prevFilters;
        return {
          ...restFilters,
        };
      });
    }
  };

  const handleDistrictChange = (selected: string[], code: string[]) => {
    const newQuery = { ...router.query };
    if (newQuery.center) {
      delete newQuery.center;
    }
    if (newQuery.block) {
      delete newQuery.block;
    }

    setSelectedCenterCode([]);

    // setEnableCenterFilter(false);
    setSelectedCenter([]);

    setSelectedBlock([]);
    setSelectedDistrict(selected);
    setSelectedBlockCode("");
    localStorage.setItem("selectedDistrict", selected[0]);

    setSelectedDistrictStore(selected[0]);
    if (selected[0] === "" || selected[0] === t("COMMON.ALL_DISTRICTS")) {
      if (filters.status) {
        setFilters({
          // states: selectedStateCode,
          role: "learner",
          status: filters.status,
        });
      } else {
        setFilters({
          // states: selectedStateCode,
          role: "learner",
        });
      }
      if (newQuery.district) {
        delete newQuery.district;
      }
      router.replace({
        pathname: router.pathname,
        query: {
          ...newQuery,
          state: selectedStateCode,
        },
      });
    } else {
      router.replace({
        pathname: router.pathname,
        query: {
          ...newQuery,
          state: selectedStateCode,
          district: code?.join(","),
        },
      });
      const districts = code?.join(",");
      setSelectedDistrictCode(districts);
      if (filters.status) {
        setFilters({
          // states: selectedStateCode,
          // districts: districts,
          role: "learner",
          status: filters.status,
        });
      } else {
        setFilters({
          // states: selectedStateCode,
          // districts: districts,
          role: "learner",
        });
      }
    }
  };
  const handleBlockChange = (selected: string[], code: string[]) => {
    setSelectedCenterCode([]);

    // setEnableCenterFilter(false);
    setSelectedCenter([]);
    const newQuery = { ...router.query };
    if (newQuery.center) {
      delete newQuery.center;
    }
    if (newQuery.block) {
      delete newQuery.block;
    }

    setSelectedBlock(selected);
    localStorage.setItem("selectedBlock", selected[0]);
    setSelectedBlockStore(selected[0]);
    if (selected[0] === "" || selected[0] === t("COMMON.ALL_BLOCKS")) {
      if (newQuery.block) {
        delete newQuery.block;
      }
      router.replace({
        pathname: router.pathname,
        query: {
          ...newQuery,
          state: selectedStateCode,
          district: selectedDistrictCode,
        },
      });
      if (filters.status) {
        setFilters({
          // states: selectedStateCode,
          // districts: selectedDistrictCode,
          role: "learner",
          status: filters.status,
        });
      } else {
        setFilters({
          // states: selectedStateCode,
          // districts: selectedDistrictCode,
          role: "learner",
        });
      }
    } else {
      router.replace({
        pathname: router.pathname,
        query: {
          ...newQuery,
          // state: selectedStateCode,
          // district: selectedDistrictCode,
          // block: code?.join(",")
        },
      });
      const blocks = code?.join(",");
      setSelectedBlockCode(blocks);
      if (filters.status) {
        setFilters({
          // states: selectedStateCode,
          // districts: selectedDistrictCode,
          // blocks: blocks,
          role: "learner",
          status: filters.status,
        });
      } else {
        setFilters({
          // states: selectedStateCode,
          // districts: selectedDistrictCode,
          // blocks: blocks,
          role: "learner",
        });
      }
    }
  };
  const handleCenterChange = async (selected: string[], code: string[]) => {
    if (code[0]) {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          state: selectedStateCode,
          district: selectedDistrictCode,
          block: selectedBlockCode,
          center: code[0],
        },
      });
    } else {
      const newQuery = { ...router.query };
      if (newQuery.center) {
        delete newQuery.center;
        router.replace({
          ...newQuery,
        });
      }
    }

    setSelectedCenterCode([code[0]]);

    setSelectedCenter(selected);
    localStorage.setItem("selectedCenter", selected[0]);
    setSelectedCenterStore(selected[0]);
    if (selected[0] === "" || selected[0] === t("COMMON.ALL_CENTERS")) {
      // setEnableCenterFilter(false);
      setSelectedCenterCode([]);
      if (filters.status) {
        setFilters({
          // states: selectedStateCode,
          // districts: selectedDistrictCode,
          // blocks: selectedBlockCode,
          role: "learner",
          status: filters.status,
        });
      } else {
        setFilters({
          // states: selectedStateCode,
          // districts: selectedDistrictCode,
          // blocks: selectedBlockCode,
          role: "learner",
        });
      }
    } else {
      // setEnableCenterFilter(true);

      setFilters({
        // states: selectedStateCode,
        // districts: selectedDistrictCode,
        // blocks: blocks,
        cohortId: code[0],
        role: "learner",
        status: [statusValue],
      });
    }
  };

  const handleSortChange = async (event: SelectChangeEvent) => {
    if (data?.length > 0) {
      if (event.target.value === "Z-A") {
        setSortBy(["name", SORT.DESCENDING]);
      } else if (event.target.value === "A-Z") {
        setSortBy(["name", SORT.ASCENDING]);
      } else {
        setSortBy(["createdAt", SORT.ASCENDING]);
      }
    }
    setSelectedSort(event.target.value);
  };

  const mapFields = (formFields: any, response: any) => {
    let initialFormData: any = {};
    formFields.fields.forEach((item: any) => {
      const userData = response?.userData;
      const customFieldValue = userData?.customFields?.find(
        (field: any) => field.fieldId === item.fieldId
      );

      const getValue = (data: any, field: any) => {
        if (item.default) {
          return item.default;
        }
        if (item?.isMultiSelect) {
          if (data[item.name] && item?.maxSelections > 1) {
            return [field?.value];
          } else if (item?.type === "checkbox") {
            return String(field?.value).split(",");
          } else {
            return field?.value?.toLowerCase();
          }
        } else {
          if (item?.type === "numeric") {
            return parseInt(String(field?.value));
          } else if (item?.type === "text") {
            return String(field?.value);
          } else {
            if (field?.value === "FEMALE" || field?.value === "MALE") {
              return field?.value?.toLowerCase();
            }
            return field?.value?.toLowerCase();
          }
        }
      };

      if (item.coreField) {
        if (item?.isMultiSelect) {
          if (userData[item.name] && item?.maxSelections > 1) {
            initialFormData[item.name] = [userData[item.name]];
          } else if (item?.type === "checkbox") {
            initialFormData[item.name] = String(userData[item.name]).split(",");
          } else {
            initialFormData[item.name] = userData[item.name];
          }
        } else if (item?.type === "numeric") {
          initialFormData[item.name] = Number(userData[item.name]);
        } else if (item?.type === "text" && userData[item.name]) {
          initialFormData[item.name] = String(userData[item.name]);
        } else {
          if (userData[item.name]) {
            initialFormData[item.name] = userData[item.name];
          }
        }
      } else {
        const fieldValue = getValue(userData, customFieldValue);

        if (fieldValue) {
          initialFormData[item.name] = fieldValue;
        }
      }
    });

    return initialFormData;
  };

  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     const obj = {
  //       limit: "10",
  //       page: 1,
  //       filters: {
  //         tenantId: formData?.tenantId,
  //       },
  //     };

  //     try {
  //       const response = await rolesList(obj);

  //       if (response?.result) {
  //         const rolesOptions = response.result.map((role: any) => ({
  //           const: role.roleId,
  //           title: role.title,
  //         }));

  //         setSchema((prevSchema) => ({
  //           ...prevSchema,
  //           properties: {
  //             ...prevSchema.properties,
  //             // role: {
  //             //   ...prevSchema.properties?.role,
  //             //   oneOf: rolesOptions,
  //             // },
  //           },
  //         }));
  //       }
  //     } catch (error) {
  //
  //     }
  //   };

  //   if (isEditForm) {
  //     fetchRoles();
  //   }
  // }, [isEditForm, formData?.tenantId]);

  const handleEdit = (rowData: any) => {
    setSubmitValue((prev) => !prev);
    setIsEditForm(true);
    setUpdateBtnDisabled(true);
    const userId = rowData?.userId;
    setUserId(userId);

    const initialFormData = {
      userId: rowData.userId || "",
      name: rowData.name || "",
      mobileNo: rowData.mobile || "",
      email: rowData.email || "",
      username: rowData.username || "",
      role: rowData.role || "",
    };

    setFormData(initialFormData);

    handleOpenAddLearnerModal();
  };

  const handleSearch = (keyword: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: keyword,
    }));
  };

  useEffect(() => {
    const fetchUserList = async () => {
      setLoading(true);
      try {
        // const fields = ["age", "districts", "states", "blocks", "gender"];
        let limit = pageLimit;
        let offset = pageOffset * limit;

        if (filters.name) {
          offset = 0;
        }

        const payload = {
          limit,
          filters: {
            role: filters.role,
            status: filters.status,
          },
          tenantCohortRoleMapping: {
            tenantId: filters?.tenantId,
            cohortId: filters?.cohortId ? [filters?.cohortId] : [],
          },
          sort: sortBy,
          offset,
        };

        const resp = await userList({ payload });

        if (resp?.totalCount >= 15) {
          setPagination(true);
          setPageSizeArray([5, 10, 15]);
        } else if (resp?.totalCount >= 10) {
          setPagination(true);
          setPageSizeArray([5, 10]);
        } else if (resp?.totalCount > 5) {
          setPagination(false);
          setPageSizeArray([5]);
        } else if (resp?.totalCount <= 5) {
          setPagination(false);
        }

        setPageCount(Math.ceil(resp?.totalCount / pageLimit));

        const finalResult = resp?.getUserDetails?.map((user: any) => {
          const ageField = user?.customFields?.find(
            (field: any) => field?.label === "AGE"
          );
          const genderField = user?.customFields?.find(
            (field: any) => field?.label === "GENDER"
          );
          const blockField = user?.customFields?.find(
            (field: any) => field?.label === "BLOCKS"
          );
          const districtField = user?.customFields?.find(
            (field: any) => field?.label === "DISTRICTS"
          );
          const stateField = user?.customFields?.find(
            (field: any) => field?.label === "STATES"
          );

          return {
            userId: user.userId,
            username: user.username,
            status: user.status,
            email: user.email ? user.email : "-",
            tenantId: user.tenantId,
            name:
              user.name.charAt(0).toUpperCase() +
              user.name.slice(1).toLowerCase(),
            role: user.role ? user.role : "Public",
            mobile: user.mobile ? user.mobile : "-",
            age: ageField ? ageField?.value : " - ",
            district: districtField
              ? districtField?.value +
                " , " +
                firstLetterInUpperCase(blockField?.value)
              : "-",
            state: stateField ? stateField?.value : "-",
            blocks: blockField
              ? firstLetterInUpperCase(blockField?.value)
              : "-",
            gender: genderField
              ? genderField.value?.charAt(0)?.toUpperCase() +
                genderField.value.slice(1).toLowerCase()
              : "-",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            createdBy: user.createdBy,
            updatedBy: user.updatedBy,
            stateCode: stateField?.code,
            districtCode: districtField?.code,
            blockCode: blockField?.code,
            districtValue: districtField ? districtField?.value : "-",
          };
        });

        if (filters?.name) {
          const prioritizedResult = finalResult.sort((a: any, b: any) => {
            const aStartsWith = a.name.toLowerCase().startsWith(filters?.name);
            const bStartsWith = b.name.toLowerCase().startsWith(filters?.name);

            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return 0;
          });

          setData(prioritizedResult);
        } else {
          setData(finalResult);
        }

        setLoading(false);
        setCohortsFetched(false);
      } catch (error: any) {
        setLoading(false);

        if (error?.response && error?.response.status === 404) {
          setData([]);
        }
      }
    };

    fetchUserList();
  }, [
    pageOffset,
    submitValue,
    pageLimit,
    sortBy,
    filters,
    parentState,
    deleteUserState,
    reassignButtonStatus,
    userType,
    editUserState,
  ]);

  const handleDelete = (rowData: any) => {
    setConfirmationModalOpen(true);
    setSelectedRowData(rowData);
  };
  const handleConfirmDelete = async () => {
    if (selectedRowData?.userId) {
      const userId = selectedRowData.userId;
      const cohortDetails = {
        status: Status.ARCHIVED,
      };

      try {
        const resp = await deleteUser(userId);
        if (resp?.responseCode === 200) {
          showToastMessage(t("COMMON.USER_DELETE_SUCCSSFULLY"), "success");
          setDeleteUserState((prevState) => !prevState);

          setConfirmationModalOpen(false);
        } else {
          showToastMessage(t("COMMON.USER_DELETE_FAILED"), "error");
        }
      } catch (error) {
        showToastMessage(t("COMMON.USER_DELETE_FAILED"), "error");
      }
    } else {
      showToastMessage(t("COMMON.SOMETHING_WENT_WRONG"), "error");
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (data.length === 0 || cohortsFetched) {
  //         return;
  //       }
  //       const newData = await Promise.all(
  //         data?.map(async (user) => {
  //           const response = await getCohortList(user.userId);
  //           // const cohortNames = response?.result?.cohortData?.map(
  //           //   (cohort: Cohort) => cohort.name,
  //           // );
  //           const cohortNames = response?.result?.cohortData
  //             ?.filter(
  //               (cohort: Cohort) =>
  //                 cohort.type !== "BLOCK" &&
  //                 cohort?.cohortMemberStatus !== "archived"
  //             )
  //             .map((cohort: Cohort) => cohort.name);
  //           const cohortIds = response?.result?.cohortData
  //             ?.filter(
  //               (cohort: Cohort) =>
  //                 cohort.type !== "BLOCK" &&
  //                 cohort?.cohortMemberStatus !== "archived"
  //             )
  //             .map((cohort: Cohort) => cohort.cohortId);

  //           const centerMembershipIdList = response?.result?.cohortData
  //             ?.filter(
  //               (cohort: Cohort) =>
  //                 cohort.type !== "BLOCK" &&
  //                 cohort?.cohortMemberStatus !== "archived"
  //             )
  //             .map((cohort: Cohort) => cohort.cohortMembershipId);
  //           const blockMembershipIdList = response?.result?.cohortData
  //             ?.filter(
  //               (cohort: Cohort) =>
  //                 cohort.type === "BLOCK" &&
  //                 cohort?.cohortMemberStatus !== "archived"
  //             )
  //             .map((cohort: Cohort) => cohort.cohortMembershipId);
  //           //  const cohortMembershipId=response?.result?.cohortData?.cohortMembershipId;

  //           let finalArray;
  //           if (cohortNames?.length >= 1) {
  //             finalArray = capitalizeFirstLetterOfEachWordInArray(cohortNames);
  //           }
  //           //   const finalArray=capitalizeFirstLetterOfEachWordInArray(cohortNames)
  //           return {
  //             ...user,
  //             centerMembershipIdList: centerMembershipIdList,
  //             blockMembershipIdList: blockMembershipIdList,
  //             cohortIds: cohortIds,
  //             centers: finalArray ? finalArray?.join(" , ") : "-",
  //           };
  //         })
  //       );
  //       setData(newData);
  //       setCohortsFetched(true);
  //     } catch (error: any) {
  //
  //     }
  //   };

  //   fetchData();
  // }, [data, cohortsFetched]);

  // useEffect(() => {
  //   const fetchLocationData = () => {
  //     try {
  //       const object = {
  //         // "limit": 20,
  //         // "offset": 0,
  //         fieldName: "states",
  //       };
  //       // const response = await getStateBlockDistrictList(object);
  //       // const result = response?.result?.values;
  //       if (typeof window !== "undefined" && window.localStorage) {
  //         const admin = localStorage.getItem("adminInfo");
  //         if (admin) {
  //           const stateField = JSON.parse(admin).customFields.find(
  //             (field: any) => field.label === "STATES"
  //           );
  //           if (!stateField.value.includes(",")) {
  //             setSelectedState([stateField.value]);
  //             setSelectedStateCode(stateField.code);

  //             // setFilters({
  //             //   states: stateField.code,
  //             //   //districts:selectedDistrictCode,
  //             //  // blocks:selectedBlockCode,
  //             //   role: role,
  //             //   status:[statusValue],
  //             // }

  //             // )
  //             // if( selectedDistrict.length===0 ||selectedDistrict[0]==="All Districts")
  //             // {
  //             //   const newQuery = { ...router.query };

  //             //   if (newQuery.district) {
  //             //    delete newQuery.district;
  //             //  }
  //             //   if (newQuery.block) {
  //             //     delete newQuery.block;
  //             //   }
  //             //   if(newQuery.center)
  //             //   {
  //             //     delete newQuery.center;
  //             //   }
  //             //   router.replace({
  //             //     pathname: router.pathname,
  //             //     query: {
  //             //       ...newQuery,
  //             //     }
  //             //   });

  //             // }
  //             // if( selectedBlock.length===0 ||selectedBlock[0]==="All Blocks")
  //             // {
  //             //   const newQuery = { ...router.query };

  //             //   // if (newQuery.district) {
  //             //   //   delete newQuery.district;
  //             //   // }

  //             //   if (newQuery.block) {
  //             //     delete newQuery.block;
  //             //   }
  //             //   if(newQuery.center)
  //             //   {
  //             //     delete newQuery.center;
  //             //   }
  //             //   router.replace({
  //             //     pathname: router.pathname,
  //             //     query: {
  //             //       ...newQuery,
  //             //     }
  //             //   });

  //             // }

  //             if (
  //               selectedDistrictCode &&
  //               selectedDistrict.length !== 0 &&
  //               selectedDistrict[0] !== t("COMMON.ALL_DISTRICTS")
  //             ) {
  //               setFilters({
  //                 states: stateField.code,
  //                 districts: selectedDistrictCode,
  //                 //  blocks:selectedBlockCode,
  //                 role: role,
  //                 status: [statusValue],
  //               });
  //             }
  //             if (
  //               selectedBlockCode &&
  //               selectedBlock.length !== 0 &&
  //               selectedBlock[0] !== t("COMMON.ALL_BLOCKS")
  //             ) {
  //               setFilters({
  //                 states: stateField.code,
  //                 districts: selectedDistrictCode,
  //                 blocks: selectedBlockCode,
  //                 role: role,
  //                 status: [statusValue],
  //               });
  //             }
  //           }

  //           // setStates(object);
  //         }
  //       }
  //       //  setStates(result);
  //     } catch (error) {
  //
  //     }
  //   };

  //   fetchLocationData();
  // }, [selectedBlockCode, selectedDistrictCode]);
  // useEffect(() => {
  //   const fetchCenterData = () => {
  //     if (userType === Role.TEAM_LEADERS) {
  //       setEnableCenterFilter(false);
  //     } else {
  //       if (selectedCenter.length !== 0) {
  //         if (
  //           selectedCenter[0] === "" ||
  //           selectedCenter[0] === t("COMMON.ALL_CENTERS")
  //         ) {
  //           setEnableCenterFilter(false);
  //         } else {
  //           setEnableCenterFilter(true);
  //         }
  //         //setEnableCenterFilter(true);
  //         if (selectedCenterCode.length !== 0) {
  //           setFilters({
  //             // states: selectedStateCode,
  //             // districts: selectedDistrictCode,
  //             // blocks: blocks,
  //             cohortId: selectedCenterCode[0],
  //             role: role,
  //             status: [statusValue],
  //           });
  //         }
  //       } else {
  //         setEnableCenterFilter(false);
  //         if (selectedCenterCode.length !== 0) setSelectedCenterCode([]);
  //       }
  //     }
  //   };

  //   fetchCenterData();
  // }, [selectedCenter, selectedCenterCode]);
  // useEffect(() => {
  //   const { state, district, block, center } = router.query;

  // {
  //   if (state) {
  //     setSelectedStateCode(state.toString());
  //   }
  //   if (district) {
  //     setSelectedDistrictCode(district.toString());
  //   }
  //   if (block) {
  //     setSelectedBlockCode(block.toString());
  //   }
  //   if ( center) {
  //     setSelectedCenter([center.toString()]);
  //   }
  //   setInitialized(true);
  // }
  // }, []);

  // useEffect(() => {

  //   // Handle replacement when only state and district codes are available
  //   if (selectedStateCode!=="" && selectedDistrictCode==="" && selectedBlockCode==="") {
  //     const newQuery = { ...router.query };

  //      if (newQuery.center) {
  //        delete newQuery.center;
  //      }
  //      if (newQuery.district) {
  //       delete newQuery.district;
  //     }
  //      if (newQuery.block) {
  //        delete newQuery.block;
  //      }
  //      router.replace({
  //        pathname: router.pathname,
  //        query: {
  //          ...newQuery,
  //          state: selectedStateCode,
  //        }
  //      });
  //    }
  //   if (selectedStateCode!=="" && selectedDistrictCode!=="" && selectedBlockCode==="") {
  //    const newQuery = { ...router.query };

  //     if (newQuery.center) {
  //       delete newQuery.center;
  //     }
  //     if (newQuery.block) {
  //       delete newQuery.block;
  //     }
  //     router.replace({
  //       pathname: router.pathname,
  //       query: {
  //         ...newQuery,
  //         state: selectedStateCode,
  //         district: selectedDistrictCode
  //       }
  //     });
  //   }

  //   // Handle replacement when state, district, and block codes are available
  //   if (selectedStateCode!=="" && selectedDistrictCode!=="" && selectedBlockCode!=="" && selectedCenter.length === 0) {
  //     const newQuery = { ...router.query };

  //     if (newQuery.center) {
  //       delete newQuery.center;
  //     }
  //     if (newQuery.block) {
  //       delete newQuery.block;
  //     }
  //     router.replace({
  //       pathname: router.pathname,
  //       query: {
  //         ...newQuery,
  //         state: selectedStateCode,
  //         district: selectedDistrictCode,
  //         block: selectedBlockCode
  //       }
  //     });
  //   }

  //   // Handle replacement when state, district, block, and center are all selected
  //   if (selectedStateCode !==""&& selectedDistrictCode!=="" && selectedBlockCode!=="" && selectedCenter.length !== 0) {
  //     if (userType !== Role.TEAM_LEADERS) {
  //       router.replace({
  //         pathname: router.pathname,
  //         query: {
  //           ...router.query,
  //           state: selectedStateCode,
  //           district: selectedDistrictCode,
  //           block: selectedBlockCode,
  //           center: selectedCenter
  //         }
  //       });
  //     }
  //   }
  // }, [selectedStateCode]);

  const handleCloseReassignModal = () => {
    // setSelectedReason("");
    // setOtherReason("");
    setIsReassignCohortModalOpen(false);
    setSelectedUserId("");
    // setConfirmButtonDisable(true);
  };

  const extraActions: any = [
    { name: "Edit", onClick: handleEdit, icon: EditIcon },
    { name: "Delete", onClick: handleDelete, icon: DeleteIcon },
  ];

  const handleUpdateAction = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    setLoading(true);
    const formData = data?.formData;
    const schemaProperties = schema.properties;

    try {
      setLoading(true);
      setConfirmButtonDisable(true);
      // if (!selectedCohortId) {
      //   showToastMessage(t("CENTERS.NO_COHORT_ID_SELECTED"), "error");
      //   return;
      // }
      let cohortDetails = {
        name: formData?.name,
        role: formData?.role,
        userId: formData?.userId,
        username: formData?.username,
        mobile: formData?.mobileNo,
        email: formData?.email,
        // status: "archived",
        // customFields: customFields,
      };

      const resp = await updateUser(formData?.userId, cohortDetails);

      if (resp?.data?.responseCode === 200 || resp?.responseCode === 201) {
        showToastMessage(t("CENTERS.CENTER_UPDATE_SUCCESSFULLY"), "success");
        setEditUserState((state) => !state);
        setLoading(false);
      } else {
        showToastMessage(t("CENTERS.CENTER_UPDATE_FAILED"), "error");
      }
    } catch (error) {
      showToastMessage(t("CENTERS.CENTER_UPDATE_FAILED"), "error");
    } finally {
      setLoading(false);
      setConfirmButtonDisable(false);
      onCloseEditForm();
      setIsEditForm(false);
    }
  };

  const handleChangeForm = (event: IChangeEvent<any>) => {
    setUpdateBtnDisabled(false);
  };
  const handleError = (error: any) => {};

  const handleTenantChange = (
    selectedNames: string[], // An array of selected tenant names
    selectedCodes: string[] // An array of selected tenant IDs
  ) => {
    if (selectedNames && selectedCodes) {
      // Join the tenant IDs into a comma-separated string
      const tenantId = selectedCodes.join(",");

      setSelectedTenant(selectedNames);
      setFilters((prevFilter) => ({
        ...prevFilter,
        tenantId: tenantId,
      }));
    } else {
      console.log("No valid tenants selected");
    }
  };

  const handleCohortChange = (
    selectedNames: string[],
    selectedCodes: string[]
  ) => {
    console.log({ selectedCodes });

    if (selectedNames && selectedCodes) {
      const cohortId = selectedCodes.join(",");
      setSelectedCohort(selectedNames);
      setFilters((prevFilter) => ({
        ...prevFilter,
        cohortId: cohortId,
      }));
    } else {
      console.log("No valid cohort selected");
    }
  };

  const userProps = {
    tenants: listOfTenants,
    cohorts: listOfCohorts,
    showAddNew: false,
    showSort: true,
    userType: userType,
    searchPlaceHolder: searchPlaceholder,
    selectedState: selectedState,
    selectedDistrict: selectedDistrict,
    setSelectedDistrict: setSelectedDistrict,
    selectedBlock: selectedBlock,
    setSelectedBlock: setSelectedBlock,
    selectedSort: selectedSort,
    statusValue: statusValue,
    selectedTenant: selectedTenant,
    selectedCohort: selectedCohort,
    handleTenantChange: handleTenantChange,
    // setStatusValue: setStatusValue,
    handleCohortChange: handleCohortChange,
    handleDistrictChange: handleDistrictChange,
    handleBlockChange: handleBlockChange,
    handleSortChange: handleSortChange,
    selectedFilter: selectedFilter,
    handleFilterChange: handleFilterChange,
    handleSearch: handleSearch,
    handleAddUserClick: handleAddUserClick,
    selectedBlockCode: selectedBlockCode,
    setSelectedBlockCode: setSelectedBlockCode,
    selectedDistrictCode: selectedDistrictCode,
    setSelectedDistrictCode: setSelectedDistrictCode,
    selectedStateCode: selectedStateCode,
    handleCenterChange: handleCenterChange,
    selectedCenter: selectedCenter,
    setSelectedCenter: setSelectedCenter,
    selectedCenterCode: selectedCenterCode,
    setSelectedCenterCode: setSelectedCenterCode,
    setSelectedStateCode: setSelectedStateCode,
    statusArchived: true,
    isTenantShow: true,
    isCohortShow: true,
    //  statusArchived:true,
  };

  return (
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
      ) : data?.length !== 0 && loading === false ? (
        <KaTableComponent
          columns={
            // role === Role.TEAM_LEADER
            getTLTableColumns(t, isMobile)
            // : getUserTableColumns(t, isMobile)
          }
          // reassignCohort={handleReassignCohort}
          data={data}
          limit={pageLimit}
          offset={pageOffset}
          PagesSelector={PagesSelector}
          PageSizeSelector={PageSizeSelectorFunction}
          pageSizes={pageSizeArray}
          extraActions={extraActions}
          showIcons={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          // reassignCohort={reassignCohort}
          noDataMessage={data?.length === 0 ? t("COMMON.NO_USER_FOUND") : ""}
          // reassignType={userType===Role.TEAM_LEADERS?  t("COMMON.REASSIGN_BLOCKS"):  t("COMMON.REASSIGN_CENTERS")}
        />
      ) : (
        loading === false &&
        data.length === 0 && (
          <Box display="flex" marginLeft="40%" gap="20px">
            {/* <Image src={glass} alt="" /> */}
            <PersonSearchIcon fontSize="large" />
            <Typography marginTop="10px" variant="h2">
              {t("COMMON.NO_USER_FOUND")}
            </Typography>
          </Box>

          // <KaTableComponent
          //   columns={
          //     role === Role.TEAM_LEADER
          //       ? getTLTableColumns(t, isMobile)
          //       : getUserTableColumns(t, isMobile)
          //   }
          //   data={data}
          //   limit={pageLimit}
          //   offset={pageOffset}
          //   PagesSelector={PagesSelector}
          //   PageSizeSelector={PageSizeSelectorFunction}
          //   pageSizes={pageSizeArray}
          //   extraActions={extraActions}
          //   showIcons={true}
          //   onEdit={handleEdit}
          //   onDelete={handleDelete}
          //   pagination={false}
          //   noDataMessage={data.length === 0 ? noUserFoundJSX : ""}
          // />
        )
      )}

      {/* <DeleteUserModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        selectedValue={selectedReason}
        setSelectedValue={setSelectedReason}
        handleDeleteAction={handleDeleteUser}
        otherReason={otherReason}
        setOtherReason={setOtherReason}
        confirmButtonDisable={confirmButtonDisable}
        setConfirmButtonDisable={setConfirmButtonDisable}
        centers={userCohort}
        userId={selectedUserId}
        userName={userName}
        userType={userType}
      /> */}
      <SimpleModal
        open={isEditForm}
        onClose={onCloseEditForm}
        showFooter={false}
        modalTitle={t("USER.UPDATE_USER_DETAILS")}
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
            formData={formData}
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
                form="update-center-form"
                disabled={updateBtnDisabled}
                sx={{
                  fontSize: "14px",
                  fontWeight: "500",
                  width: "auto",
                  height: "40px",
                  marginLeft: "10px",
                }}
                onClick={() => {
                  setSubmittedButtonStatus(true);
                }}
              >
                {t("COMMON.UPDATE")}
              </Button>
            </Box>
          </DynamicForm>
        )}
      </SimpleModal>

      <ConfirmationModal
        message={t("USER.DELETE_USER_CONFIRMATION_MESSAGE")}
        handleAction={handleConfirmDelete}
        buttonNames={{
          primary: t("COMMON.YES"),
          secondary: t("COMMON.CANCEL"),
        }}
        handleCloseModal={() => setConfirmationModalOpen(false)}
        modalOpen={confirmationModalOpen}
      />

      <ReassignCenterModal
        open={isReassignCohortModalOpen}
        onClose={handleCloseReassignModal}
        userType={userType}
        cohortData={centers}
        blockList={blocks}
        userId={selectedUserId}
        blockName={block}
        districtName={district}
        blockCode={blockCode}
        districtCode={districtCode}
        cohortId={cohortId}
        centers={assignedCenters}
      />

      <CommonUserModal
        open={openAddLearnerModal}
        onClose={handleCloseAddLearnerModal}
        formData={formData}
        isEditModal={true}
        userId={userId}
        onSubmit={handleModalSubmit}
        userType={
          userType === Role.LEARNERS
            ? FormContextType.STUDENT
            : userType === Role.FACILITATORS
              ? FormContextType.TEACHER
              : FormContextType.TEAM_LEADER
        }
      />
    </HeaderComponent>
  );
};

export default UserTable;
