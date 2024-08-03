import { DataType, SortDirection } from "ka-table";

export const getUserTableColumns = (t: any, isMobile: any) => {
  return [
    {
      key: "name",
      title: t("FORM.NAME"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 160 : null,
    },
    {
      key: "status",
      title: t("FORM.STATUS"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 160 : null,
    },

    {
      key: "age",
      title: t("FORM.AGE"),
      dataType: DataType.String,
      width: isMobile ? 160 : null,
    },
    {
      key: "gender",
      title: t("FORM.GENDER"),
      dataType: DataType.String,
      width: isMobile ? 160 : null,
    },
    {
      key: "mobile",
      title: t("FORM.MOBILE_NUMBER"),
      dataType: DataType.String,
      width: isMobile ? 160 : null,
    },
    {
      key: "state",
      title: t("FORM.STATE"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 160 : null,
    },
    {
      key: "district",
      title: t("FORM.DISTRICT"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 160 : null,
    },

    {
      key: "blocks",
      title: t("FORM.BLOCK"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 160 : null,
    },
    {
      key: "centers",
      title: t("FORM.CENTER"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 160 : null,
    },
    {
      key: "actions",
      title: t("FORM.ACTION"),
      dataType: DataType.String,
      width: isMobile ? 160 : null,
    },
  ];
};

export const getTLTableColumns = (t: any, isMobile: any) => {
  return [
    {
      key: "name",
      title: t("FORM.NAME"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      // width: isMobile?160:null,
    },
    {
      key: "status",
      title: t("FORM.STATUS"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      // width: isMobile?160:null,
    },

    {
      key: "age",
      title: t("FORM.AGE"),
      dataType: DataType.String,
      //  width: isMobile?160:null,
    },
    {
      key: "gender",
      title: t("FORM.GENDER"),
      dataType: DataType.String,
      // width: isMobile?160:null,
    },

    {
      key: "state",
      title: t("FORM.STATE"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      // width: isMobile?160:null,
    },
    {
      key: "district",
      title: t("FORM.DISTRICT"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      // width: isMobile?160:null,
    },

    {
      key: "blocks",
      title: t("FORM.BLOCK"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      // width: isMobile?160:null,
    },

    {
      key: "actions",
      title: t("FORM.ACTION"),
      dataType: DataType.String,
      //  width: isMobile?160:null,
    },
  ];
};

export const getCenterTableData = (t: any, isMobile: any) => {
  return [
    {
      key: "name",
      title: t("TABLE_TITLE.NAME"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 95 : "",
    },
    {
      key: "status",
      title: t("TABLE_TITLE.STATUS"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 95 : "",
    },
    {
      key: "updatedBy",
      title: t("TABLE_TITLE.UPDATED_BY"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 95 : "",
    },
    {
      key: "createdBy",
      title: t("TABLE_TITLE.CREATED_BY"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 95 : "",
    },
    {
      key: "createdAt",
      title: t("TABLE_TITLE.CREATED_DATE"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 95 : "",
    },

    {
      key: "updatedAt",
      title: t("TABLE_TITLE.UPDATED_DATE"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 95 : "",
    },

    {
      key: "actions",
      title: t("TABLE_TITLE.ACTIONS"),
      dataType: DataType.String,
      width: isMobile ? 125 : "",
    },
  ];
};
