import React from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { userList } from "../services/userList";
import { useState, useEffect } from "react";
import UserComponent from "@/components/UserComponent";
import { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "next-i18next";

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
const Faciliator: React.FC = () => {
  const [selectedState, setSelectedState] = useState("All states");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedBlock, setSelectedBlock] = useState("All Blocks");
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [data, setData] = useState<UserDetails[]>([]);
  const { t } = useTranslation();

  
  const handleStateChange = (event: SelectChangeEvent) => {
    setSelectedState(event.target.value as string);
  };

  const handleDistrictChange = (event: SelectChangeEvent) => {
    setSelectedDistrict(event.target.value as string);
  };

  const handleBlockChange = (event: SelectChangeEvent) => {
    setSelectedBlock(event.target.value as string);
  };
  const handleSortChange = (event: SelectChangeEvent) => {
    setSelectedSort(event.target.value as string);
  };
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const limit = 0;
        const page = 0;
        const sort = ["createdAt", "asc"];
        const filters = { role: "Teacher" };
        const resp = await userList({ limit, page, filters, sort });
        const result = resp?.getUserDetails;

        setData(result[0]);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchUserList();
  }, []);

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
        <KaTableComponent columns={columns} data={data} />
      </div>
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

export default Faciliator;
