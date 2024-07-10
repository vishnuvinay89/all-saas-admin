// components/KaTableComponent.tsx

import React from "react";
import { ITableProps, Table } from "ka-table";
import { SortingMode, PagingPosition } from "ka-table/enums";
import { Paper } from "@mui/material";
import "ka-table/style.css";
import { IPagingProps } from "ka-table/props";
import { updatePageIndex, updatePageSize } from "ka-table/actionCreators";

interface KaTableComponentProps {
  columns: ITableProps["columns"];
  data: ITableProps["data"];
  offset?: any;
  limit?: any;
  PagesSelector?: any;
  PageSizeSelector?:any
}

const KaTableComponent: React.FC<KaTableComponentProps> = ({
  columns,
  data,
  offset,
  limit,
  PagesSelector,
  PageSizeSelector
}) => {
  const tableProps: ITableProps = {
    columns,
    data,
    rowKeyField: "id",
    sortingMode: SortingMode.Single,
  };

  return (
    <Paper>
      <Table
        {...tableProps}
        paging={{
          enabled: true,
          pageIndex: 0,
          pageSize: limit,
          pageSizes: [5, 10,15],
          position: PagingPosition.Bottom,
        }}
        childComponents={{
          pagingSizes: {
            content: (props) => <PageSizeSelector {...props} />,
          },
          pagingPages: {
            content: (props) => <PagesSelector {...props} />,
          },
        }}
      />
    </Paper>
  );
};

export default KaTableComponent;
