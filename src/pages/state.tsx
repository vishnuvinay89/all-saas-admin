import React, { useState, useEffect } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import UserComponent from "@/components/UserComponent";
import StateData from "./dummyAPI/stateData";
import Pagination from "@mui/material/Pagination";
import { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import { useTranslation } from "next-i18next";

type StateDetails = {
  state: string;
  districts: DistrictDetails[];
};

type DistrictDetails = {
  district: string;
  blocks: BlockDetails[];
};

type BlockDetails = {
  block: string;
};


const State: React.FC = () => {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState<string[]>([]);
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [pageSizeArray, setPageSizeArray] = useState<number[]>([]);
  const [stateData, setStateData] = useState<StateDetails[]>([]);
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [pageSize, setPageSize] = useState<string | number>("");
  const [sortBy, setSortBy] = useState<["state", "asc" | "desc"]>([
    "state",
    "asc",
  ]);
  const [pageCount, setPageCount] = useState(1);


  const columns = [
    {
      key: "state",
      title: t("MASTER.STATE_NAMES"),
      dataType: DataType.String,
    },
  ];
  

  const handleChange = (event: SelectChangeEvent<string>) => {
    setPageSize(event.target.value);
    setPageLimit(Number(event.target.value));
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageOffset(value - 1);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value === "Z-A") {
      setSortBy(["state", "desc"]);
    } else if (event.target.value === "A-Z") {
      setSortBy(["state", "asc"]);
    } else {
      setSortBy(["state", "asc"]);
    }

    setSelectedSort(event.target.value as string);
  };

  useEffect(() => {
    const fetchStateData = () => {
      const limit = pageLimit;
      const offset = pageOffset * limit;

      const sortedData = [...StateData].sort((a, b) => {
        const [field, order] = sortBy;
        if (order === "asc") {
          return (a as any)[field].localeCompare((b as any)[field]);
        } else {
          return (b as any)[field].localeCompare((a as any)[field]);
        }
      });

      const paginatedData = sortedData.slice(offset, offset + limit);

      setPageCount(Math.ceil(StateData.length / pageLimit));
      setStateData(paginatedData as StateDetails[]);
      setPageSizeArray([5, 10, 15]);
    };

    fetchStateData();
  }, [pageOffset, pageLimit, sortBy]);

  const userProps = {
    userType: t("MASTER.STATE"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_STATE"),
    selectedState: selectedState,
    selectedSort: selectedSort,
    handleStateChange: handleChange,
    handleSortChange: handleSortChange,
    states: stateData.map((stateDetail) => stateDetail.state),
    showStateDropdown: false,
  };

  return (
    <UserComponent {...userProps}>
      <KaTableComponent
        columns={columns}
        data={stateData.map((stateDetail) => ({
          state: stateDetail.state,
        }))}
        limit={pageLimit}
        offset={pageOffset}
        PagesSelector={() => (
          <Pagination
            color="primary"
            count={pageCount}
            page={pageOffset + 1}
            onChange={handlePaginationChange}
          />
        )}
        PageSizeSelector={() => (
          <PageSizeSelector
            handleChange={handleChange}
            pageSize={pageSize}
            options={pageSizeArray}
          />
        )}
        extraActions={[]} 
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

export default State;
