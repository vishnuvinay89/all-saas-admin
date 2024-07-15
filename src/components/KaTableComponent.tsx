// components/KaTableComponent.tsx

import React from "react";
import { ITableProps, Table } from "ka-table";
import { SortingMode, PagingPosition } from "ka-table/enums";
import { Paper } from "@mui/material";
import "ka-table/style.css";
import { IPagingProps } from "ka-table/props";
import { updatePageIndex, updatePageSize } from "ka-table/actionCreators";
import ActionCell from "./ActionCell";

interface KaTableComponentProps {
  columns: ITableProps["columns"];
  data?: ITableProps["data"];
  offset?: any;
  limit?: any;
  PagesSelector?: any;
  PageSizeSelector?: any;
  onEdit: (rowData: any) => void;
  onDelete: (rowData: any) => void;
  extraActions: {
    name: string;
    onClick: (rowData: any) => void;
  }[];
  showEdit?: boolean;
  showDelete?: boolean;
}

const KaTableComponent: React.FC<KaTableComponentProps> = ({
  columns,
  data,
  offset,
  limit,
  PagesSelector,
  PageSizeSelector,
  onEdit,
  onDelete,
  extraActions,
  showEdit,
  showDelete,
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
          enabled: (data?.length ?? 0) >= 5 ? true : false, // to do dynamic limit for enable  pagination and page sizes by data
          pageIndex: 0,
          pageSize: limit,
          pageSizes: [5, 10, 15],
          position: PagingPosition.Bottom,
        }}
        childComponents={{
          pagingSizes: {
            content: (props) => <PageSizeSelector {...props} />,
          },
          pagingPages: {
            content: (props) => <PagesSelector {...props} />,
          },
          cell: {
            content: (props) => {
              if (props.column.key === "actions") {
                return (
                  <ActionCell
                    rowData={props.rowData}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    extraActions={extraActions}
                    showEdit={showEdit}
                    showDelete={showDelete}
                  />
                );
              }
              return null;
            },
          },
        }}
      />
    </Paper>
  );
};

export default KaTableComponent;
