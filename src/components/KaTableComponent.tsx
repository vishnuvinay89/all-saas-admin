// components/KaTableComponent.tsx

import React, { useState } from "react";
import { ITableProps, Table } from "ka-table";
import { SortingMode, PagingPosition } from "ka-table/enums";
import { Paper, Checkbox } from "@mui/material";
import "ka-table/style.css";
import { IPagingProps } from "ka-table/props";
import { updatePageIndex, updatePageSize } from "ka-table/actionCreators";
import ActionCell from "./ActionCell";
import ActionIcon from "./ActionIcon";

interface KaTableComponentProps {
  columns: ITableProps["columns"];
  data?: ITableProps["data"];
  offset?: any;
  limit?: any;
  PagesSelector?: any;
  PageSizeSelector?: any;
  pageSizes?: any;
  onDelete?: any;
  onEdit?: any;
  onChange?: any;
  extraActions: {
    name: string;
    onClick: (rowData: any) => void;
    icon: React.ElementType;
  }[];
  paginationEnable?: boolean;
  showIcons?: boolean;
}

const KaTableComponent: React.FC<KaTableComponentProps> = ({
  columns,
  data,
  offset,
  limit,
  PagesSelector,
  PageSizeSelector,
  paginationEnable = true,
  extraActions,
  onEdit,
  onDelete,
  showIcons,
  pageSizes,
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  const handleCheckboxChange = (rowId: number) => {
    setSelectedRowIds((prevSelected) =>
      prevSelected.includes(rowId)
        ? prevSelected.filter((id) => id !== rowId)
        : [...prevSelected, rowId]
    );
  };

  const tableProps: ITableProps = {
    columns,
    data,
    rowKeyField: "id",
    sortingMode: SortingMode.Single,
  };

  return (
    <Paper>
      <div className="ka-table-wrapper">
        <Table
          {...tableProps}
          paging={{
            enabled: paginationEnable,
            pageIndex: 0,
            pageSize: limit,
            pageSizes: pageSizes,
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
                    <ActionIcon
                      rowData={props.rowData}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  );
                }
                if (props.column.key === "selection-cell") {
                  return (
                    <Checkbox
                      checked={selectedRowIds.includes(props.rowData.userId)}
                      onChange={() =>
                        handleCheckboxChange(props.rowData.userId)
                      }
                    />
                  );
                }
                return null;
              },
            },
            headCell: {
              content: (props) => {
                return <div className="table-header">{props.column.title}</div>;
              },
            },
          }}
        />
      </div>
    </Paper>
  );
};

export default KaTableComponent;
