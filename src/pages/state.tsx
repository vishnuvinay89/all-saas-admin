import React, { useState } from "react";
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
  const [selectedState, setSelectedState] = useState("");
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [stateData, setStateData] = useState<StateDetails[]>(StateData);
  const [selectedSort, setSelectedSort] = useState(t("MASTER.SORT"));
  const [pageSize, setPageSize] = useState<string | number>("");

  const columns = [
    {
      key: "state",
      title: t("MASTER.STATE"),
      dataType: DataType.String,
    },
  ];

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

  const handleStateChange = (event: SelectChangeEvent) => {
    setSelectedState(event.target.value as string);
  };

  const userProps = {
    userType: t("MASTER.STATE"),
    searchPlaceHolder: t("MASTER.SEARCHBAR_PLACEHOLDER_STATE"),
    selectedState: selectedState,
    selectedSort: selectedSort,
    handleStateChange: handleStateChange,
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
        offset={pageOffset * pageLimit}
        PagesSelector={() => (
          <Pagination
            color="primary"
            count={Math.ceil(stateData.length / pageLimit)}
            page={pageOffset + 1}
            onChange={handlePaginationChange}
          />
        )}
        PageSizeSelector={() => (
          <PageSizeSelector handleChange={handleChange} pageSize={pageSize} />
        )}
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
