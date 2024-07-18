import React from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useEffect } from "react";
import UserComponent from "@/components/UserComponent";
import { useTranslation } from "next-i18next";

import Pagination from "@mui/material/Pagination";

import { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import { getCohortList, updateCohortUpdate } from "@/services/cohortService";
import { Role, Storage } from "@/utils/app.constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationModal from "@/components/ConfirmationModal";
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

  const [data, setData] = useState<UserDetails[]>([]);
  const { t } = useTranslation();
  const [pageSize, setPageSize] = React.useState<string | number>("");
  const [open, setOpen] = React.useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState<boolean>(false);

  const [selectedCohortId, setSelectedCohortId] = React.useState<string>("");

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
        name: "New Cohort",
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

      const userId = localStorage.getItem(Storage.USERID) || "";
      const filters = { role: Role.TEACHER };
      const resp = await getCohortList(userId);
      const result = resp?.cohortData;

      setData(result);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
    setSelectedSort(event.target.value as string);
  };
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const limit = pageLimit;
        // const page = 0;
        const offset = pageOffset;
        // const sort = ["createdAt", "asc"];
        const filters = { role: Role.TEACHER };
        const userId = localStorage.getItem(Storage.USERID) || "";

        const resp = await getCohortList(userId);
        const result = resp;
        console.log("result", result);

        setData(result);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchUserList();
  }, [pageOffset, pageLimit]);

  const handleEdit = (rowData: any) => {
    console.log("Edit row:", rowData);
    // Handle edit action here
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

  const userProps = {
    userType: t("SIDEBAR.COHORTS"),
    searchPlaceHolder: t("COHORTS.SEARCHBAR_PLACEHOLDER"),
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
    <>
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
      <UserComponent {...userProps}>
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
          />
        </div>
      </UserComponent>
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
