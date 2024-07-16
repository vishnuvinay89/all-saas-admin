import React, { useState, useEffect } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { userList } from "../services/UserList";
import {  getCohortList } from "../services/GetCohortList";
import UserComponent from "@/components/UserComponent";
import { useTranslation } from "next-i18next";
import { deleteUser  } from "../services/DeleteUser";
import Pagination from "@mui/material/Pagination";
import DeleteUserModal from "@/components/DeleteUserModal";
import { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import CustomModal from "@/components/CustomModal";
type UserDetails = {
  userId: any;
  username: any;
  name: any;
  role: any;
  mobile: any;
  centers?: any;
  Programs?: any;
};

interface Cohort {
  cohortId: string;
  name: string;
  parentId: string | null;
  type: string;
  customField: any[];
}

const columns = [
  // {
  //   key: "userId",
  //   title: "ID",
  //   dataType: DataType.String,
  // },
  {
    key: "name",
    title: "Name",
    dataType: DataType.String,
  },
  {
    key: "centers",
    title: "Centers",
    dataType: DataType.String,
  },
  {
    key: "programs",
    title: "Programs",
    dataType: DataType.String,
  },
  {
    key: "actions",
    title: "Actions",
    dataType: DataType.String,
  },
];

const Facilitators: React.FC = () => {
  const [selectedState, setSelectedState] = React.useState<string[]>([]);
 const [selectedDistrict, setSelectedDistrict] = React.useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = React.useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [data, setData] = useState<UserDetails[]>([]);
  const [cohortsFetched, setCohortsFetched] = useState(false);
  const { t } = useTranslation();
  const [pageSize, setPageSize] = React.useState<string | number>("");
  const [sortBy, setSortBy] = useState(["createdAt", "asc"]);
  const [pageCount, setPageCount] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
   const [otherReason, setOtherReason] = useState('');
   const [confirmButtonDisable, setConfirmButtonDisable] = useState(true);


  const handleChange = (event: SelectChangeEvent<typeof pageSize>) => {
    setPageSize(event.target.value);
    setPageLimit(Number(event.target.value));
  };

  
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
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
    <PageSizeSelector handleChange={handleChange} pageSize={pageSize} />
  );
  const handleStateChange = (selected: string[]) => {
    setSelectedState(selected);
    console.log('Selected categories:', selected);
  };
  const handleDistrictChange = (selected: string[]) => {
    setSelectedDistrict(selected);
    console.log('Selected categories:', selected);
  };
  const handleBlockChange = (selected: string[]) => {
    setSelectedBlock(selected);
    console.log('Selected categories:', selected);
  };
  const handleSortChange = async (event: SelectChangeEvent) => {
    
     // let sort;
      if (event.target.value === "Z-A") {
         setSortBy(["name", "desc"]);
      } else if (event.target.value === "A-Z") {
        setSortBy(["name", "asc"]);
      } else {
        setSortBy(["createdAt", "asc"]);
      }
      
    setSelectedSort(event.target.value as string);
  };
  const handleEdit = (rowData: any) => {
    console.log("Edit row:", rowData);
    // Handle edit action here
  };

  const handleDelete = async(rowData: any) => {
    setIsDeleteModalOpen(true);
    setSelectedUserId(rowData.userId);
    //const userData="";

    console.log("Delete row:", rowData.userId);
    

  };
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const limit = pageLimit;
        const offset = pageOffset*limit;
        const filters = { role: "Teacher" , status:"active"};
        const sort=sortBy
        const resp = await userList({ limit, filters, sort, offset });
        const result = resp?.getUserDetails;
       // console.log(resp?.totalCount)
        setPageCount(Math.ceil(resp?.totalCount/pageLimit));

        setData(result);
        setCohortsFetched(false);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchUserList();
  }, [pageOffset, pageLimit, sortBy]);

  useEffect(() => {
    const fetchData = async () => {
      if (data.length === 0 || cohortsFetched) return;
      const newData = await Promise.all(data.map(async (user) => {
        const response = await getCohortList(user.userId);
        const cohortNames = response?.result?.cohortData?.map((cohort: Cohort) => cohort.name);

        return {
          ...user,
          centers: cohortNames,
        };
      }));

      setData(newData);
      setCohortsFetched(true);
    };

    fetchData();
  }, [data, cohortsFetched]);
  const handleCloseDeleteModal = () => {
    setSelectedReason('')
    setOtherReason('')
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
    // { name: "Send", onClick: handleSend },
    // { name: "STAR", onClick: handleStar },
  ];

  const userProps = {
    userType: t("SIDEBAR.FACILITATORS"),
    searchPlaceHolder: t("FACILITATORS.SEARCHBAR_PLACEHOLDER"),
    selectedState: selectedState,
    selectedDistrict: selectedDistrict,
    selectedBlock: selectedBlock,
    selectedSort: selectedSort,
    handleStateChange: handleStateChange,
    handleDistrictChange: handleDistrictChange,
    handleBlockChange: handleBlockChange,
    handleSortChange: handleSortChange,
  };

  return (
    <UserComponent {...userProps}>
      <div>
        <KaTableComponent
          columns={columns}
          data={data}
          limit={pageLimit}
          offset={pageOffset}
          PagesSelector={PagesSelector}
          PageSizeSelector={PageSizeSelectorFunction}
        //   onEdit={handleEdit}
        //   onDelete={handleDelete}
        // extraActions={extraActions}
         // showEdit={true}
         // showDelete={true}
        />
      </div>
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


    </UserComponent>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Facilitators;
