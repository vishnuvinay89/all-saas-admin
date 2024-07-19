import React, { useState, useEffect, useCallback, useMemo } from "react";
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

  // State management
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [stateData, setStateData] = useState<StateDetail[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("Sort");
  const [sortBy, setSortBy] = useState<["label", "asc" | "desc"]>([
    "label",
    "asc",
  ]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const columns = useMemo(
    () => [
      {
        key: "label",
        title: t("MASTER.STATE_NAMES"),
        dataType: DataType.String,
      },
      {
        key: "actions",
        title: t("MASTER.ACTIONS"),
        dataType: DataType.String,
      },
    ],
    [t]
  );

  const handleChange = useCallback((event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    setPageSize(value);
    setPageLimit(value);
  }, []);

  const handlePaginationChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPageOffset(value - 1);
    },
    []
  );

  const handleSortChange = useCallback((event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    setSelectedSort(selectedValue);
    setSortBy(["label", selectedValue === "Z-A" ? "desc" : "asc"]);
  }, []);

  const handleFilterChange = useCallback((event: SelectChangeEvent<string>) => {
    setSelectedFilter(event.target.value as string);
  }, []);

  const handleEdit = useCallback((rowData: any) => {
    console.log("Edit row:", rowData);
  }, []);

  const handleDelete = useCallback((rowData: any) => {
    console.log("Delete row:", rowData);
  }, []);

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
      } catch (error) {
        console.error("Error fetching state data", error);
      }
    };

    fetchStateData();
  }, [pageOffset, pageLimit, sortBy]);

  const userProps = useMemo(
    () => ({
      userType: t("MASTER.STATE"),
      searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_STATE"),
      selectedSort,
      handleStateChange: handleChange,
      handleSortChange: handleSortChange,
      states: stateData.map((stateDetail) => stateDetail.label),
      showStateDropdown: false,
      selectedFilter,
      handleFilterChange: handleFilterChange,
    }),
    [
      t,
      selectedSort,
      handleChange,
      handleSortChange,
      stateData,
      selectedFilter,
      handleFilterChange,
    ]
  );

  return (
    <div>
      <HeaderComponent {...userProps}>
        <KaTableComponent
          columns={columns}
          data={stateData.map((stateDetail) => ({
            label:
              stateDetail.label?.toLocaleLowerCase().charAt(0).toUpperCase() +
              stateDetail.label?.toLocaleLowerCase().slice(1),
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
              options={[5, 10, 15]}
            />
          )}
          extraActions={[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </HeaderComponent>
    </div>
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
