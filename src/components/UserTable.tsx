import DeleteUserModal from "@/components/DeleteUserModal";
import HeaderComponent from "@/components/HeaderComponent";
import PageSizeSelector from "@/components/PageSelector";
import { SORT, Status } from "@/utils/app.constant";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { DataType, SortDirection } from "ka-table/enums";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import glass from "../../public/images/empty_hourglass.svg";
import KaTableComponent from "../components/KaTableComponent";
import Loader from "../components/Loader";
import { deleteUser } from "../services/DeleteUser";
import { getCohortList } from "../services/GetCohortList";
import { userList, getUserDetails } from "../services/UserList";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AddLearnerModal from "@/components/AddLeanerModal";
import AddFacilitatorModal from "./AddFacilitator";
import { Role } from "@/utils/app.constant";
import { getFormRead } from "@/services/CreateUserService";
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
};
type FilterDetails = {
  role: any;
  status?: any;
  districts?: any;
  states?: any;
  blocks?: any;
};

interface Cohort {
  cohortId: string;
  name: string;
  parentId: string | null;
  type: string;
  customField: any[];
}
interface UserTableProps {
  role: string;
  userType: string;
  searchPlaceholder: string;
  handleAddUserClick: any;
}
const columns = [
  // {
  //   key: "userId",
  //   title: "ID",
  //   dataType: DataType.String,
  // },
  {
    key: "selection-cell",
    width: 50,
  },
  {
    key: "name",
    title: "Name",
    dataType: DataType.String,
    sortDirection: SortDirection.Ascend,
    width: 160,
  },
  {
    key: "centers",
    title: "Centers",
    dataType: DataType.String,
    sortDirection: SortDirection.Ascend,
    width: 160,
  },
  // {
  //   key: "programs",
  //   title: "Programs",
  //   dataType: DataType.String,
  // },
  {
    key: "age",
    title: "Age",
    dataType: DataType.String,
    width: 160,
  },
  {
    key: "gender",
    title: "Gender",
    dataType: DataType.String,
    width: 160,
  },
  {
    key: "mobile",
    title: "Mobile Number",
    dataType: DataType.String,
    width: 160,
  },
  {
    key: "state",
    title: "State",
    dataType: DataType.String,
    sortDirection: SortDirection.Ascend,
    width: 160,
  },
  {
    key: "district",
    title: "District",
    dataType: DataType.String,
    sortDirection: SortDirection.Ascend,
    width: 160,
  },

  {
    key: "blocks",
    title: "Bocks",
    dataType: DataType.String,
    sortDirection: SortDirection.Ascend,
    width: 160,
  },
  {
    key: "actions",
    title: "Actions",
    dataType: DataType.String,
    width: 160,
  },
];

const UserTable: React.FC<UserTableProps> = ({
  role,
  userType,
  searchPlaceholder,
  handleAddUserClick,
}) => {
  const [selectedState, setSelectedState] = React.useState<string[]>([]);
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
  const [pageCount, setPageCount] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [confirmButtonDisable, setConfirmButtonDisable] = useState(false);
  const [pagination, setPagination] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [formdata, setFormData] = useState<any>();

  const [loading, setLoading] = useState<boolean | undefined>(undefined);
  const [openAddLearnerModal, setOpenAddLearnerModal] = React.useState(false);
  const [userId, setUserId] = useState();

  const handleOpenAddLearnerModal = () => {
    console.log("hello");
    setOpenAddLearnerModal(true);
  };

  const handleCloseAddLearnerModal = () => {
    setOpenAddLearnerModal(false);
  };
  const handleAddLearnerClick = () => {
    handleOpenAddLearnerModal();
  };
  const [openAddFacilitatorModal, setOpenAddFacilitatorModal] =
    React.useState(false);
  const handleOpenAddFacilitatorModal = () => {
    setOpenAddFacilitatorModal(true);
  };

  const handleCloseAddFacilitatorModal = () => {
    setOpenAddFacilitatorModal(false);
  };

  const handleAddFaciliatorClick = () => {
    handleOpenAddFacilitatorModal();
  };

  const [filters, setFilters] = useState<FilterDetails>({
    role: role,
  });

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
    <Pagination
      color="primary"
      count={pageCount}
      page={pageOffset + 1}
      onChange={handlePaginationChange}
    />
  );

  const PageSizeSelectorFunction = () => (
    <PageSizeSelector
      handleChange={handleChange}
      pageSize={pageSize}
      options={pageSizeArray}
    />
  );
  const handleStateChange = async (selected: string[], code: string[]) => {
    setSelectedDistrict([]);
    setSelectedBlock([]);

    setSelectedState(selected);

    if (selected[0] === "") {
      if (filters.status) setFilters({ status: filters.status, role: role });
      else setFilters({ role: role });
    } else {
      const stateCodes = code?.join(",");
      setSelectedStateCode(stateCodes);
      if (filters.status)
        setFilters({ status: filters.status, states: stateCodes, role: role });
      else setFilters({ states: stateCodes, role: role });
    }

    console.log("Selected categories:", typeof code[0]);
  };
  const handleFilterChange = async (event: SelectChangeEvent) => {
    console.log(event.target.value as string);
    setSelectedFilter(event.target.value as string);
    if (event.target.value === "Active") {
      console.log(true);
      setFilters((prevFilters) => ({
        ...prevFilters,
        status: Status.ACTIVE,
      }));
    } else if (event.target.value === "Archived") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        status: Status.ARCHIVED,
      }));
    } else {
      setFilters((prevFilters) => {
        const { status, ...restFilters } = prevFilters;
        return {
          ...restFilters,
        };
      });
    }
    console.log(filters);
  };

  const handleDistrictChange = (selected: string[], code: string[]) => {
    setSelectedBlock([]);
    setSelectedDistrict(selected);

    if (selected[0] === "") {
      if (filters.status) {
        setFilters({
          status: filters.status,
          states: selectedStateCode,
          role: role,
        });
      } else {
        setFilters({
          states: selectedStateCode,
          role: role,
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
          role: role,
        });
      } else {
        setFilters({
          states: selectedStateCode,
          districts: districts,
          role: role,
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
          role: role,
        });
      } else {
        setFilters({
          states: selectedStateCode,
          districts: selectedDistrictCode,
          role: role,
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
          role: role,
        });
      } else {
        setFilters({
          states: selectedStateCode,
          districts: selectedDistrictCode,
          blocks: blocks,
          role: role,
        });
      }
    }
    console.log("Selected categories:", selected);
  };
  const handleSortChange = async (event: SelectChangeEvent) => {
    // let sort;
    if (event.target.value === "Z-A") {
      setSortBy(["name", SORT.DESCENDING]);
    } else if (event.target.value === "A-Z") {
      setSortBy(["name", SORT.ASCENDING]);
    } else {
      setSortBy(["createdAt", SORT.ASCENDING]);
    }

    setSelectedSort(event.target.value as string);
  };
  const mapFields = (formFields: any, response: any) => {
    let initialFormData: any = {};
    formFields.fields.forEach((item: any) => {
      const userData = response?.userData;
      const customField = userData?.customFields?.find((field: any) => field.fieldId === item.fieldId);
  
      const getValue = (data: any, field: any) => {
        if (item?.isMultiSelect) {
          if (item?.type === 'checkbox') {
            return String(field.value).split(',');
          }
          return [field.value];
        } else {
          if (item?.type === 'numeric') {
            return Number(field.value);
          } else if (item?.type === 'text') {
            return String(field.value);
          } else {
            return field.value;
          }
        }
      };
  
      if (item.coreField) {
        initialFormData[item.name] = item?.isMultiSelect
          ? userData[item.name] ? [userData[item.name]] : userData[item.name] || ''
          : item?.type === 'numeric' ? Number(userData[item.name])
            : item?.type === 'text' ? String(userData[item.name])
              : userData[item.name];
      } else {
        initialFormData[item.name] = getValue(userData, customField);
      }
    });
    return initialFormData;
  };
  const handleEdit = async (rowData: any) => {
    console.log("Edit row:", rowData);
  
    try {
      const userId = rowData.userId;
      setUserId(userId);
      const fieldValue = true;
      const response = await getUserDetails(userId, fieldValue);
      console.log(role);
  
      let formFields;
      if (Role.STUDENT === role) {
        formFields = await getFormRead("USERS", "STUDENT");
        setFormData(mapFields(formFields, response));
        handleOpenAddLearnerModal();
      } else if (Role.TEACHER === role) {
        formFields = await getFormRead("USERS", "TEACHER");
        setFormData(mapFields(formFields, response));
        handleOpenAddFacilitatorModal();
      }
  
      console.log("response", response);
      console.log("formFields", formFields);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (rowData: any) => {
    setIsDeleteModalOpen(true);
    setSelectedUserId(rowData.userId);
    //const userData="";

    console.log("Delete row:", rowData.userId);
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
        const fields = ["age", "districts", "states", "blocks"];
        const limit = pageLimit;
        const offset = pageOffset * limit;
        // const filters = { role: role , status:"active"};
        const sort = sortBy;
        console.log("filters", filters);
        const resp = await userList({ limit, filters, sort, offset, fields });
        const result = resp?.getUserDetails;
        // console.log(resp?.totalCount)
        if (resp?.totalCount >= 15) {
          setPageSizeArray([5, 10, 15]);
        } else if (resp?.totalCount >= 10) {
          // setPageSize(resp?.totalCount);
          setPageSizeArray([5, 10]);
        } else if (resp?.totalCount > 5) {
          setPagination(false);

          setPageSizeArray([5]);
        } else if (resp?.totalCount <= 5) {
          setPagination(false);
          // setPageSize(resp?.totalCount);
          //PageSizeSelectorFunction();
        }

        setPageCount(Math.ceil(resp?.totalCount / pageLimit));
        console.log(result);
        const finalResult = result.map((user: any) => {
          const ageField = user.customFields.find(
            (field: any) => field.name === "age"
          );
          const blockField = user.customFields.find(
            (field: any) => field.name === "blocks"
          );
          const districtField = user.customFields.find(
            (field: any) => field.name === "districts"
          );
          const stateField = user.customFields.find(
            (field: any) => field.name === "states"
          );

          return {
            userId: user.userId,
            username: user.username,
            name:
              user.name.charAt(0).toUpperCase() +
              user.name.slice(1).toLowerCase(),
            role: user.role,
            gender: user.gender,
            mobile: user.mobile === "NaN" ? "" : user.mobile,
            age: ageField ? ageField.value : null,
            district: districtField ? districtField.value : null,
            state: stateField ? stateField.value : null,
            blocks: blockField ? blockField.value : null,
            // centers: null,
            // Programs: null,
          };
        });
        setData(finalResult);
        setLoading(false);
        setCohortsFetched(false);
      } catch (error: any) {
        setLoading(false);

        if (error?.response && error?.response.status === 404) {
          setData([]);
          //showToastMessage("No data found", "info");
        }

        console.log(error);
      }
    };
    fetchUserList();
  }, [pageOffset, pageLimit, sortBy, filters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data.length === 0 || cohortsFetched) {
          return;
        }
        const newData = await Promise.all(
          data.map(async (user) => {
            const response = await getCohortList(user.userId);
            const cohortNames = response?.result?.cohortData?.map(
              (cohort: Cohort) => cohort.name
            );

            return {
              ...user,
              centers: cohortNames?.join(" , "),
            };
          })
        );

        setData(newData);
        setCohortsFetched(true);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();
  }, [data, cohortsFetched]);
  const handleCloseDeleteModal = () => {
    setSelectedReason("");
    setOtherReason("");
    setIsDeleteModalOpen(false);
  };

  const handleDeleteUser = async (category: string) => {
    try {
      console.log(selectedUserId);
      const userId = selectedUserId;
      const userData = {
        userData: [
          {
            reason: selectedReason,
            status: "archived",
          },
        ],
      };
      const response = await deleteUser(userId, userData);
      handleCloseDeleteModal();
    } catch (error) {
      console.log("error while deleting entry", error);
    }
  };

  const extraActions: any = [
    { name: "Edit", onClick: handleEdit, icon: EditIcon },
    { name: "Delete", onClick: handleDelete, icon: DeleteIcon },
  ];

  const userProps = {
    userType: userType,
    searchPlaceHolder: searchPlaceholder,
    selectedState: selectedState,
    selectedDistrict: selectedDistrict,
    selectedBlock: selectedBlock,
    selectedSort: selectedSort,
    handleStateChange: handleStateChange,
    handleDistrictChange: handleDistrictChange,
    handleBlockChange: handleBlockChange,
    handleSortChange: handleSortChange,
    selectedFilter: selectedFilter,
    handleFilterChange: handleFilterChange,
    handleSearch: handleSearch,
    handleAddUserClick: handleAddUserClick,
    selectedBlockCode:selectedBlockCode,
    selectedDistrictCode:selectedDistrictCode,
    selectedStateCode:selectedStateCode

  };

  return (
    <HeaderComponent {...userProps}>
      {loading ? (
        <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />
      ) : data.length !== 0 && loading === false ? (
        <KaTableComponent
          columns={columns}
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
        />
      ) : (
        loading === false &&
        data.length === 0 && (
          <Box display="flex" marginLeft="40%" gap="20px">
            {/* <Image src={glass} alt="" /> */}
            <PersonSearchIcon fontSize="large" />
            <Typography marginTop="10px">
              {t("COMMON.NO_USER_FOUND")}
            </Typography>
          </Box>
        )
      )}

      {/* <KaTableComponent
          columns={columns}
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
          
        /> */}
      <DeleteUserModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        selectedValue={selectedReason}
        setSelectedValue={setSelectedReason}
        handleDeleteAction={handleDeleteUser}
        otherReason={otherReason}
        setOtherReason={setOtherReason}
        confirmButtonDisable={confirmButtonDisable}
        setConfirmButtonDisable={setConfirmButtonDisable}
      />
      <AddLearnerModal
        open={openAddLearnerModal}
        onClose={handleCloseAddLearnerModal}
        formData={formdata}
        isEditModal={true}
        userId={userId}
      />
      <AddFacilitatorModal
        open={openAddFacilitatorModal}
        onClose={handleCloseAddFacilitatorModal}
        formData={formdata}
        isEditModal={true}
        userId={userId}
      />
    </HeaderComponent>
  );
};

// export async function getStaticProps({ locale }: any) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ["common"])),
//     },
//   };
// }

export default UserTable;
