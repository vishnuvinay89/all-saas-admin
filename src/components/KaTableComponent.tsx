import React, { useState } from "react";
import { ITableProps, Table } from "ka-table";
import { SortingMode, PagingPosition } from "ka-table/enums";
import { Paper, Checkbox, Chip } from "@mui/material";
import "ka-table/style.css";
import ActionIcon from "./ActionIcon";
import { format } from "date-fns";
import { DataKey, DateFormat, Status } from "@/utils/app.constant";
import { useTranslation } from "react-i18next";
import UserNameCell from "./UserNameCell";
import { firtstLetterInUpperCase } from "@/utils/Helper";
// import { getUserName } from "@/utils/helper.ts";

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
  noData?: any;
  pagination?: boolean;
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
  noData,
  pagination = true,
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const { t } = useTranslation();

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
    ...(pagination && {
      paging: {
        enabled: paginationEnable,
        pageIndex: 0,
        pageSize: limit,
        pageSizes: pageSizes,
        position: PagingPosition.Bottom,
      },
    }),
  };

  return (
    <Paper>
      <div className="ka-table-wrapper">
        <Table
          {...tableProps}
          paging={{
            enabled: paginationEnable,
            pageIndex: offset,
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
                if (
                  props.column.key === DataKey.ACTIONS 
                  
                ) {
                  return (
                    <ActionIcon
                      rowData={props.rowData}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      disable={
                        props.rowData?.status === Status.ARCHIVED ? true : false
                      }
                    />
                  );
                }
                if (props.column.key === DataKey.UPDATEDAT) {
                  return format(
                    props.rowData?.updatedAt,
                    DateFormat.YYYY_MM_DD
                  );
                } else if (props.column.key === DataKey.CREATEDAT) {
                  return format(
                    props.rowData?.createdAt,
                    DateFormat.YYYY_MM_DD
                  );
                } else if (props.column.key === DataKey.CREATEDBY) {
                  return <UserNameCell userId={props.rowData?.createdBy} />;
                } else if (props.column.key === DataKey.UPDATEDBY) {
                  return <UserNameCell userId={props.rowData?.updatedBy} />;
                }
                if (props.column.key === DataKey.STATUS) {
                  if (props.rowData?.status === Status.ARCHIVED) {
                    return (
                      <Chip
                        label={firtstLetterInUpperCase(props.rowData?.status)}
                        color="error"
                        variant="outlined"
                      />
                    );
                  } else {
                    return (
                      <Chip
                        label={firtstLetterInUpperCase(props.rowData?.status)}
                        color="success"
                        variant="outlined"
                      />
                    );
                  }
                }
                if (props.column.key === "selection-cell") {
                  return (
                    <Checkbox
                      checked={selectedRowIds.includes(props.rowData.id)}
                      onChange={() => handleCheckboxChange(props.rowData.id)}
                    />
                  );
                }
                return <div className="table-cell">{props.value}</div>;
              },
            },
            headCell: {
              content: (props) => {
                return <div className="table-header">{props.column.title}</div>;
              },
            },
          }}
          noData={{
            text: t("COURSE_PLANNER.DATA_NOT_FOUND"),
          }}
        />
      </div>
    </Paper>
  );
};

export default KaTableComponent;
