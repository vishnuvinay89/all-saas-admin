import { DataType, SortDirection } from "ka-table";

interface ColumnConfig {
  key: string;
  titleKey: string;
  width?: number;
  sortDirection?: SortDirection;
}

const generateColumns = (
  t: any,
  configs: ColumnConfig[],
  isMobile: boolean
) => {
  return configs.map((config) => ({
    key: config.key,
    title: t(config.titleKey),
    dataType: DataType.String,
    sortDirection: config.sortDirection,
    width: isMobile && config.width ? config.width : config.width || undefined,
  }));
};

export const getUserTableColumns = (t: any, isMobile: boolean) => {
  const configs: ColumnConfig[] = [
    { key: "name", titleKey: "FORM.NAME", width: 130 },
    { key: "status", titleKey: "FORM.STATUS", width: 130 },
    { key: "age", titleKey: "FORM.AGE", width: 100 },
    { key: "gender", titleKey: "FORM.GENDER", width: 130 },
    { key: "mobile", titleKey: "FORM.MOBILE_NUMBER", width: 130 },
    { key: "state", titleKey: "FORM.STATE", width: 130, sortDirection: SortDirection.Ascend },
    { key: "district", titleKey: "FORM.DISTRICT", width: 130, sortDirection: SortDirection.Ascend },
    { key: "blocks", titleKey: "FORM.BLOCK", width: 130, sortDirection: SortDirection.Ascend },
    { key: "centers", titleKey: "FORM.CENTER", width: 130, sortDirection: SortDirection.Ascend },
    { key: "updatedBy", titleKey: "TABLE_TITLE.UPDATED_BY", width: 130, sortDirection: SortDirection.Ascend },
    { key: "createdBy", titleKey: "TABLE_TITLE.CREATED_BY", width: 130, sortDirection: SortDirection.Ascend },
    { key: "createdAt", titleKey: "TABLE_TITLE.CREATED_DATE", width: 160, sortDirection: SortDirection.Ascend },
    { key: "updatedAt", titleKey: "TABLE_TITLE.UPDATED_DATE", width: 160, sortDirection: SortDirection.Ascend },
    { key: "actions", titleKey: "FORM.ACTION", width: 130 },
  ];

  return generateColumns(t, configs, isMobile);
};

export const getTLTableColumns = (t: any, isMobile: boolean) => {
  const configs: ColumnConfig[] = [
    { key: "name", titleKey: "FORM.NAME", width: 130 },
    { key: "status", titleKey: "TABLE_TITLE.STATUS", width: 130, sortDirection: SortDirection.Ascend },
    { key: "age", titleKey: "FORM.AGE", width: 100 },
    { key: "gender", titleKey: "FORM.GENDER", width: 130 },
    { key: "state", titleKey: "FORM.STATE", width: 130, sortDirection: SortDirection.Ascend },
    { key: "district", titleKey: "FORM.DISTRICT", width: 130, sortDirection: SortDirection.Ascend },
    { key: "blocks", titleKey: "FORM.BLOCK", width: 130 },
    { key: "updatedBy", titleKey: "TABLE_TITLE.UPDATED_BY", width: 130, sortDirection: SortDirection.Ascend },
    { key: "createdBy", titleKey: "TABLE_TITLE.CREATED_BY", width: 130, sortDirection: SortDirection.Ascend },
    { key: "createdAt", titleKey: "TABLE_TITLE.CREATED_DATE", width: 160, sortDirection: SortDirection.Ascend },
    { key: "updatedAt", titleKey: "TABLE_TITLE.UPDATED_DATE", width: 160, sortDirection: SortDirection.Ascend },
    { key: "actions", titleKey: "FORM.ACTION", width: 130 },
  ];

  return generateColumns(t, configs, isMobile);
};

export const getCenterTableData = (t: any, isMobile: boolean) => {
  const configs: ColumnConfig[] = [
    { key: "name", titleKey: "TABLE_TITLE.NAME", width: 95 },
    { key: "status", titleKey: "TABLE_TITLE.STATUS", width: 95},
    { key: "updatedBy", titleKey: "TABLE_TITLE.UPDATED_BY", width: 95 },
    { key: "createdBy", titleKey: "TABLE_TITLE.CREATED_BY", width: 95 },
    { key: "createdAt", titleKey: "TABLE_TITLE.CREATED_DATE", width: 95 },
    { key: "updatedAt", titleKey: "TABLE_TITLE.UPDATED_DATE", width: 95 },
    { key: "customFieldValues", titleKey: "FORM.TYPE_OF_COHORT", width: 95 },
    { key: "actions", titleKey: "TABLE_TITLE.ACTIONS", width: 125 },
  ];

  return generateColumns(t, configs, isMobile);
};
