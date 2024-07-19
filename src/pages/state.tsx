import React, { useState, useEffect } from "react";
import KaTableComponent from "../components/KaTableComponent";
import { DataType } from "ka-table/enums";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HeaderComponent from "@/components/HeaderComponent";
import Pagination from "@mui/material/Pagination";
import { SelectChangeEvent } from "@mui/material/Select";
import PageSizeSelector from "@/components/PageSelector";
import { useTranslation } from "next-i18next";
import { getStateList } from "@/services/MasterDataService";

type StateDetail = {
  label: string;
};

const State: React.FC = () => {
  const { t } = useTranslation();
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [pageSizeArray, setPageSizeArray] = useState<number[]>([]);
  const [stateData, setStateData] = useState<StateDetail[]>([]);
  const [selectedSort, setSelectedSort] = useState("Sort");
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<["label", "asc" | "desc"]>([
    "label",
    "asc",
  ]);
  const [pageCount, setPageCount] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const columns = [
    {
      key: "label",
      title: t("MASTER.STATE_NAMES"),
      dataType: DataType.String,
    },
  ];

  const handleChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setPageSize(value);
    setPageLimit(value);
  };
  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageOffset(value - 1);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setSelectedSort(selectedValue);
    if (selectedValue === "Z-A") {
      setSortBy(["label", "desc"]);
    } else if (selectedValue === "A-Z") {
      setSortBy(["label", "asc"]);
    } else {
      setSortBy(["label", "asc"]);
    }
  };
  const handleFilterChange = async (event: SelectChangeEvent) => {
    console.log(event.target.value as string);
    setSelectedFilter(event.target.value as string);
  };
  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const data = await getStateList();
        const sortedData = [...data.result].sort((a, b) => {
          const [field, order] = sortBy;
          return order === "asc"
            ? a[field].localeCompare(b[field])
            : b[field].localeCompare(a[field]);
        });

        const offset = pageOffset * pageLimit;
        const paginatedData = sortedData.slice(offset, offset + pageLimit);

        setPageCount(Math.ceil(data.result.length / pageLimit));
        setStateData(paginatedData);
        setPageSizeArray([5, 10, 15]);
      } catch (error) {
        console.error("Error fetching state data", error);
      }
    };

    fetchStateData();
  }, [pageOffset, pageLimit, sortBy]);

  const userProps = {
    userType: t("MASTER.STATE"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_STATE"),
    selectedSort: selectedSort,
    handleStateChange: handleChange,
    handleSortChange: handleSortChange,
    states: stateData.map((stateDetail) => stateDetail.label),
    showStateDropdown: false,
    selectedFilter:selectedFilter,
    handleFilterChange: handleFilterChange

  };

  return (
    <HeaderComponent {...userProps}>
      <KaTableComponent
        columns={columns}
        data={stateData.map((stateDetail) => ({
          label: stateDetail.label,
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
    </HeaderComponent>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default State;
