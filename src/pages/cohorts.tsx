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
import { getCohortList, updateCohortUpdate } from "@/services/cohortService";
import { Role, Storage } from "@/utils/app.constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "@/components/ConfirmationModal";
import CustomModal from "@/components/CustomModal";
import { Box, TextField } from "@mui/material";
import { SortDirection  } from 'ka-table/enums';

type UserDetails = {
  userId: any;
  username: any;
  name: any;
  role: any;
  mobile: any;
  centers?: any;
  Programs?: any;
};
const columns = [
  // {
  //   key: "userId",
  //   title: "ID",
  //   dataType: DataType.String,
  // },
  {
    key: "cohortName",
    title: "Name",
    dataType: DataType.String,
    sortDirection: SortDirection.Ascend

  },
  // {
  //   key: "centers",
  //   title: "Centers",
  //   dataType: DataType.String,
  // },
  // {
  //   key: "programs",
  //   title: "Programs",
  //   dataType: DataType.String,
  // },
  {
    key: "actions",
    title: "Actions",
    dataType: DataType.String,
  },
];
const Cohorts: React.FC = () => {
  const [selectedState, setSelectedState] = React.useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = React.useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = React.useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [data, setData] = useState<UserDetails[]>([]);
  const { t } = useTranslation();
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

      setData(result);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
    setSelectedSort(event.target.value as string);
  };

  const handleFilterChange = async (event: SelectChangeEvent) => {
    console.log(event.target.value as string);
    setSelectedFilter(event.target.value as string);
  };

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
      const cohortName = result?.[0]?.cohortName;
      setData(result);
      setInputName(cohortName);
      const childData = result?.[0]?.childData;
      
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };
  useEffect(() => {
    fetchUserList();
  }, [pageOffset, pageLimit]);

  const handleEdit = (rowData: any) => {
    console.log("Edit row:", rowData);
    // Handle edit action here
    setIsEditModalOpen(true);
    if (rowData) {
      const cohortId = rowData?.cohortId;
      setSelectedCohortId(cohortId);
    }
    setConfirmButtonDisable(false);
  };

  const handleDelete = (rowData: any) => {
    setConfirmationModalOpen(true);
    if (rowData) {
      const cohortId = rowData?.cohortId;
      setSelectedCohortId(cohortId);
    }
    handleActionForDelete();
    console.log("Delete row:", rowData);
    // Handle delete action here
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
    setConfirmButtonDisable(true);

    if (selectedCohortId) {
      let cohortDetails = {
        name: inputName,
      };
      const resp = await updateCohortUpdate(selectedCohortId, cohortDetails);
      console.log("resp:", resp);
    } else {
      console.log("No cohort Id Selected");
    }
    onCloseEditMOdel();
    fetchUserList();
  };
  const handleSearch = (keyword: string) => {

  };
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
    handleSearch:handleSearch
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
        message={t("CENTERS.REQUEST_TO_DELETE_HAS_BEEN_SENT")}
        handleAction={handleActionForDelete}
        buttonNames={{
          primary: t("COMMON.YES"),
          secondary: t("COMMON.NO_GO_BACK"),
        }}
        handleCloseModal={handleCloseModal}
        modalOpen={confirmationModalOpen}
      />
      <HeaderComponent {...userProps}>
        <div>
          <KaTableComponent
            columns={columns}
            data={data}
            limit={pageLimit}
            offset={pageOffset}
            PagesSelector={PagesSelector}
            PageSizeSelector={PageSizeSelectorFunction}
            extraActions={extraActions}
            showIcons={true}
            onEdit={handleEdit}
          onDelete={handleDelete}
          
          />
        </div>
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

export default Cohorts;
