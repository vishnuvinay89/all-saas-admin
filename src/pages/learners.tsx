import React, { useState, useEffect } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { userList, getCohortList } from "../services/userList";
import UserComponent from "@/components/UserComponent";
import { useTranslation } from "next-i18next";

import Pagination from "@mui/material/Pagination";

import { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";

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

const Learners: React.FC = () => {
  const [selectedState, setSelectedState] = useState("All states");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedBlock, setSelectedBlock] = useState("All Blocks");
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [data, setData] = useState<UserDetails[]>([]);
  const [cohortsFetched, setCohortsFetched] = useState(false);
  const { t } = useTranslation();
  const [pageSize, setPageSize] = React.useState<string | number>("");
  const [sortBy, setSortBy] = useState(["createdAt", "asc"]);
  const [pageCount, setPageCount] = useState(1);

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

  const handleStateChange = (event: SelectChangeEvent) => {
    setSelectedState(event.target.value as string);
  };

  const handleDistrictChange = (event: SelectChangeEvent) => {
    setSelectedDistrict(event.target.value as string);
  };

  const handleBlockChange = (event: SelectChangeEvent) => {
    setSelectedBlock(event.target.value as string);
  };

  const handleSortChange = async (event: SelectChangeEvent) => {
    //console.log(event.target.value)
    
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
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const limit = pageLimit;
        const offset = pageOffset*limit;
        const filters = { role: "Student" };
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

  const userProps = {
    userType: t("SIDEBAR.LEARNERS"),
    searchPlaceHolder: t("LEARNERS.SEARCHBAR_PLACEHOLDER"),
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
        />
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

export default Learners;
