import { DataType, SortDirection } from "ka-table";

interface ColumnConfig {
  key: string;
  titleKey: string;
  width?: number;
  sortDirection?: SortDirection;
  isSortable?: boolean;
}

const generateColumns = (
  t: any,
  configs: ColumnConfig[],
  isMobile: boolean
) => {
  return configs.map((config) => ({
    key: config.key,
    title: t(config.titleKey).toUpperCase(),
    dataType: DataType.String,
    sortDirection: config.sortDirection,
    width: isMobile && config.width ? config.width : config.width || undefined,
    isSortable: config.isSortable,
  }));
};

export const getUserTableColumns = (t: any, isMobile: boolean) => {
  const configs: ColumnConfig[] = [
    { key: "name", titleKey: "TABLE_TITLE.NAME", width: 130 },
    { key: "age", titleKey: "TABLE_TITLE.AGE", width: 70 },
    { key: "gender", titleKey: "TABLE_TITLE.GENDER", width: 90 },
    { key: "mobile", titleKey: "TABLE_TITLE.MOBILE", width: 130 },
    { key: "district", titleKey: "TABLE_TITLE.DISTRICT_BLOCK", width: 160 },
    // { key: "blocks", titleKey: "TABLE_TITLE.BLOCK", width: 130},
    { key: "centers", titleKey: "TABLE_TITLE.CENTER", width: 130 },
    { key: "updatedBy", titleKey: "TABLE_TITLE.UPDATED_BY", width: 160 },
    // { key: "createdBy", titleKey: "TABLE_TITLE.CREATED_BY", width: 130, sortDirection: SortDirection.Ascend },
    // { key: "createdAt", titleKey: "TABLE_TITLE.CREATED_DATE", width: 160, sortDirection: SortDirection.Ascend },
    { key: "updatedAt", titleKey: "TABLE_TITLE.UPDATED_DATE", width: 160 },
    {
      key: "actions",
      titleKey: "TABLE_TITLE.ACTIONS",
      width: 170,
      isSortable: false,
    },
  ];

  return generateColumns(t, configs, isMobile);
};

export const getTLTableColumns = (t: any, isMobile: boolean) => {
  const configs: ColumnConfig[] = [
    { key: "name", titleKey: "TABLE_TITLE.NAME", width: 130 },
    { key: "mobile", titleKey: "TABLE_TITLE.MOBILE", width: 130 },
    { key: "email", titleKey: "TABLE_TITLE.EMAIL", width: 130 },
    { key: "username", titleKey: "TABLE_TITLE.USERNAME", width: 130 },
    { key: "role", titleKey: "TABLE_TITLE.ROLE", width: 100 },
    // { key: "updatedBy", titleKey: "TABLE_TITLE.UPDATED_BY", width: 130 },
    { key: "createdBy", titleKey: "TABLE_TITLE.CREATED_BY", width: 130 },
    { key: "createdAt", titleKey: "TABLE_TITLE.CREATED_DATE", width: 130 },
    { key: "updatedAt", titleKey: "TABLE_TITLE.UPDATED_DATE", width: 130 },
    // { key: "roleDefine", titleKey: "TABLE_TITLE.ROLE", width: 130 },
    {
      key: "actions",
      titleKey: "TABLE_TITLE.ACTIONS",
      width: 170,
      isSortable: false,
    },
  ];

  return generateColumns(t, configs, isMobile);
};

export const getTenantTableData = (t: any, isMobile: boolean,role:any) => {
  console.log({role});
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") ?? '{}');
  // const localRoleCheck = adminInfo?.tenantData?.[0]?.roleName === "cohort admin";
  const isCohortAdmin = adminInfo?.tenantData?.[0]?.roleName === "cohort admin" ? true : false;
  
  const configs: ColumnConfig[] = [
    { key: "name", titleKey: "TABLE_TITLE.NAME", width: 130 },
    // { key: "updatedBy", titleKey: "TABLE_TITLE.UPDATED_BY", width: 130 },
    // { key: "createdBy", titleKey: "TABLE_TITLE.CREATED_BY", width: 130 },
    { key: "createdAt", titleKey: "TABLE_TITLE.CREATED_DATE", width: 130 },
    // { key: "updatedAt", titleKey: "TABLE_TITLE.UPDATED_DATE", width: 130 },
  
    // {
    //   key: "totalActiveMembers",
    //   titleKey: "TABLE_TITLE.ACTIVE_LEARNERS",
    //   width: 130,
    // },
    // {
    //   key: "totalArchivedMembers",
    //   titleKey: "TABLE_TITLE.ARCHIVED_LEARNERS",
    //   width: 130,
    // },
    { key: "status", titleKey: "TABLE_TITLE.STATUS", width: 90 },
    
    ...(role == true ? [{ key: "roleDefine", titleKey: "TABLE_TITLE.CREATE_TENANT_ADMIN", width: 130 }] : []),
    ...(isCohortAdmin ==false?[{ key: "actions", titleKey: "TABLE_TITLE.ACTIONS", width: 125 }]:[]),
    // ...(role== true ?[{ key: "actions", titleKey: "TABLE_TITLE.ACTIONS", width: 125 }]:[]),
  ];
  

  return generateColumns(t, configs, isMobile);
};
export const getCohortTableData = (t: any, isMobile: boolean,role:any) => {
  const configs: ColumnConfig[] = [
    { key: "name", titleKey: "TABLE_TITLE.NAME", width: 130 },
    { key: "type", titleKey: "TABLE_TITLE.TYPE", width: 90 },
    // { key: "updatedBy", titleKey: "TABLE_TITLE.UPDATED_BY", width: 130 },
    // { key: "createdBy", titleKey: "TABLE_TITLE.CREATED_BY", width: 130 },
    { key: "createdAt", titleKey: "TABLE_TITLE.CREATED_DATE", width: 130 },
    { key: "updatedAt", titleKey: "TABLE_TITLE.UPDATED_DATE", width: 130 },

    // {
    //   key: "totalActiveMembers",
    //   titleKey: "TABLE_TITLE.ACTIVE_LEARNERS",
    //   width: 130,
    // },
    // {
    //   key: "totalArchivedMembers",
    //   titleKey: "TABLE_TITLE.ARCHIVED_LEARNERS",
    //   width: 130,
    // },
    // { key: "roleDefine", titleKey: "TABLE_TITLE.ROLE", width: 130 },
    ...(role == true ? [{ key: "cohortAdmin", titleKey: "TABLE_TITLE.CREATE_COHORT_ADMIN", width: 130 }] : []),
    { key: "actions", titleKey: "TABLE_TITLE.ACTIONS", width: 125 },
  ];

  return generateColumns(t, configs, isMobile);
};

//master data
export const getStateDataMaster = (t: any, isMobile: boolean) => {
  const configs: ColumnConfig[] = [
    {
      key: "label",
      titleKey: t("TABLE_TITLE.STATE").toUpperCase(),
      width: 130,
    },
    { key: "value", titleKey: t("TABLE_TITLE.CODE").toUpperCase(), width: 130 },
    {
      key: "createdBy",
      titleKey: t("TABLE_TITLE.CREATED_BY").toUpperCase(),
      width: 130,
    },
    {
      key: "updatedBy",
      titleKey: t("TABLE_TITLE.UPDATED_BY").toUpperCase(),
      width: 130,
    },
    {
      key: "createdAt",
      titleKey: t("TABLE_TITLE.CREATED_DATE").toUpperCase(),
      width: 130,
    },
    {
      key: "updatedAt",
      titleKey: t("TABLE_TITLE.UPDATED_DATE").toUpperCase(),
      width: 130,
    },
  ];

  return generateColumns(t, configs, isMobile);
};

export const getDistrictTableData = (t: any, isMobile: boolean) => {
  const configs: ColumnConfig[] = [
    {
      key: "label",
      titleKey: t("TABLE_TITLE.DISTRICT").toUpperCase(),
      width: 130,
    },
    { key: "value", titleKey: t("TABLE_TITLE.CODE").toUpperCase(), width: 130 },
    {
      key: "createdBy",
      titleKey: t("TABLE_TITLE.CREATED_BY").toUpperCase(),
      width: 130,
    },
    {
      key: "updatedBy",
      titleKey: t("TABLE_TITLE.UPDATED_BY").toUpperCase(),
      width: 130,
    },
    {
      key: "createdAt",
      titleKey: t("TABLE_TITLE.CREATED_DATE").toUpperCase(),
      width: 130,
    },
    {
      key: "updatedAt",
      titleKey: t("TABLE_TITLE.UPDATED_DATE").toUpperCase(),
      width: 130,
    },
    {
      key: "actions",
      titleKey: t("TABLE_TITLE.ACTIONS").toUpperCase(),
      width: 160,
    },
  ];

  return generateColumns(t, configs, isMobile);
};

export const getBlockTableData = (t: any, isMobile: boolean) => {
  const configs: ColumnConfig[] = [
    { key: "name", titleKey: t("TABLE_TITLE.BLOCK").toUpperCase(), width: 130 },
    { key: "code", titleKey: t("TABLE_TITLE.CODE").toUpperCase(), width: 130 },
    {
      key: "createdBy",
      titleKey: t("TABLE_TITLE.CREATED_BY").toUpperCase(),
      width: 130,
    },
    {
      key: "updatedBy",
      titleKey: t("TABLE_TITLE.UPDATED_BY").toUpperCase(),
      width: 130,
    },
    {
      key: "createdAt",
      titleKey: t("TABLE_TITLE.CREATED_DATE").toUpperCase(),
      width: 130,
    },
    {
      key: "updatedAt",
      titleKey: t("TABLE_TITLE.UPDATED_DATE").toUpperCase(),
      width: 130,
    },
    {
      key: "actions",
      titleKey: t("TABLE_TITLE.ACTIONS").toUpperCase(),
      width: 160,
    },
  ];

  return generateColumns(t, configs, isMobile);
};
