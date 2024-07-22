// components/KaTableComponent.tsx

import React from "react";
import { ITableProps, Table } from "ka-table";
import { SortingMode, PagingPosition } from "ka-table/enums";
import { Paper, Typography } from "@mui/material";
import "ka-table/style.css";
import { IPagingProps } from "ka-table/props";
import { updatePageIndex, updatePageSize } from "ka-table/actionCreators";
import ActionCell from "./ActionCell";
import ActionIcon from "./ActionIcon";
import { useTranslation } from "next-i18next";
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

  extraActions: {
    name: string;
    onClick: (rowData: any) => void;
    icon: React.ElementType;
  }[];

  showIcons?: boolean;
}

const KaTableComponent: React.FC<KaTableComponentProps> = ({
  columns,
  data,
  offset,
  limit,
  PagesSelector,
  PageSizeSelector,

  extraActions,
  onEdit,
  onDelete,
  showIcons,
  pageSizes,
}) => {
  const tableProps: ITableProps = {
    columns,
    data,
    rowKeyField: "id",
    sortingMode: SortingMode.Single,
  };
  const { t } = useTranslation();
  // Check if data exists
  const hasData = data && data.length > 0;

  return (
    <Paper>
      <div className="ka-table-wrapper">
        {hasData ? (
          <Table
            {...tableProps}
            paging={{
              enabled: true, // to do dynamic limit for enable  pagination and page sizes by data
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
                      <>
                        {/* <ActionCell
                    rowData={props.rowData}
                    extraActions={extraActions}
                    showIcons={showIcons}
                    onEdit={function (rowData: any): void {
                      throw new Error("Function not implemented.");
                    }}
                    onDelete={function (rowData: any): void {
                      throw new Error("Function not implemented.");
                    }}
                  /> */}
                        <ActionIcon
                          rowData={props.rowData}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      </>
                    );
                  }
                  return null;
                },
              },
            }}
          />
        ) : (
          <Typography
            variant="body1"
            align="center"
            style={{ padding: "16px" }}
          >
            {t("COMMON.NO_DATA_FOUND")}
          </Typography>
        )}
      </div>
    </Paper>
  );
};

export default KaTableComponent;
