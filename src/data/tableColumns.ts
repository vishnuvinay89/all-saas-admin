import { DataType, SortDirection } from "ka-table";

const createColumn = (key: string, title: string, dataType: DataType, isMobile: boolean, sortDirection?: SortDirection, width?: number) => ({
  key,
  title,
  dataType,
  sortDirection,
  width: isMobile ? (width || 160) : width,
});

export const getUserTableColumns = (t: any, isMobile: boolean) => [
  createColumn("name", t("FORM.NAME"), DataType.String, isMobile),
  createColumn("status", t("FORM.STATUS"), DataType.String, isMobile),
  createColumn("age", t("FORM.AGE"), DataType.String, isMobile),
  createColumn("gender", t("FORM.GENDER"), DataType.String, isMobile),
  createColumn("mobile", t("FORM.MOBILE_NUMBER"), DataType.String, isMobile, undefined, 130),
  createColumn("state", t("FORM.STATE"), DataType.String, isMobile, SortDirection.Ascend, 130),
  createColumn("district", t("FORM.DISTRICT"), DataType.String, isMobile, SortDirection.Ascend, 130),
  createColumn("blocks", t("FORM.BLOCK"), DataType.String, isMobile),
  createColumn("centers", t("FORM.CENTER"), DataType.String, isMobile),
  createColumn("updatedBy", t("TABLE_TITLE.UPDATED_BY"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("createdBy", t("TABLE_TITLE.CREATED_BY"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("createdAt", t("TABLE_TITLE.CREATED_DATE"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("updatedAt", t("TABLE_TITLE.UPDATED_DATE"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("actions", t("FORM.ACTION"), DataType.String, isMobile),
];

export const getTLTableColumns = (t: any, isMobile: boolean) => [
  createColumn("name", t("FORM.NAME"), DataType.String, isMobile),
  createColumn("status", t("FORM.STATUS"), DataType.String, isMobile),
  createColumn("age", t("FORM.AGE"), DataType.String, isMobile),
  createColumn("gender", t("FORM.GENDER"), DataType.String, isMobile),
  createColumn("state", t("FORM.STATE"), DataType.String, isMobile, SortDirection.Ascend, 160),
  createColumn("district", t("FORM.DISTRICT"), DataType.String, isMobile, SortDirection.Ascend, 160),
  createColumn("blocks", t("FORM.BLOCK"), DataType.String, isMobile),
  createColumn("updatedBy", t("TABLE_TITLE.UPDATED_BY"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("createdBy", t("TABLE_TITLE.CREATED_BY"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("createdAt", t("TABLE_TITLE.CREATED_DATE"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("updatedAt", t("TABLE_TITLE.UPDATED_DATE"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("actions", t("FORM.ACTION"), DataType.String, isMobile),
];

export const getCenterTableData = (t: any, isMobile: boolean) => [
  createColumn("name", t("TABLE_TITLE.NAME"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("status", t("TABLE_TITLE.STATUS"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("updatedBy", t("TABLE_TITLE.UPDATED_BY"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("createdBy", t("TABLE_TITLE.CREATED_BY"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("createdAt", t("TABLE_TITLE.CREATED_DATE"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("updatedAt", t("TABLE_TITLE.UPDATED_DATE"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("customFieldValues", t("FORM.TYPE_OF_COHORT"), DataType.String, isMobile, SortDirection.Ascend, 95),
  createColumn("actions", t("TABLE_TITLE.ACTIONS"), DataType.String, isMobile, undefined, 125),
];
