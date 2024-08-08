import { DataType, SortDirection } from "ka-table";

export const getUserTableColumns = (t: any, isMobile: any) => {
  return [
    {
      key: "name",
      title: t("FORM.NAME"),
      dataType: DataType.String,
     // sortDirection: SortDirection.Ascend,
     width: isMobile ? 160 : undefined,
    },
    {
      key: "status",
      title: t("FORM.STATUS"),
      dataType: DataType.String,
    ///  sortDirection: SortDirection.Ascend,
     width: isMobile ? 160 : undefined,
    },

    {
      key: "age",
      title: t("FORM.AGE"),
      dataType: DataType.String,
      width: isMobile ? 160 : undefined,
    },
    {
      key: "gender",
      title: t("FORM.GENDER"),
      dataType: DataType.String,
      width: isMobile ? 160 : undefined,
    },
    {
      key: "mobile",
      title: t("FORM.MOBILE_NUMBER"),
      dataType: DataType.String,
      width: 130,
    },
    {
      key: "state",
      title: t("FORM.STATE"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: 130,
    },
    {
      key: "district",
      title: t("FORM.DISTRICT"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: 130,
    },

    {
      key: "blocks",
      title: t("FORM.BLOCK"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 160 : undefined,
    },
    {
      key: "centers",
      title: t("FORM.CENTER"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: isMobile ? 160 : undefined,
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
      title: t("FORM.ACTION"),
      dataType: DataType.String,
      width: isMobile ? 160 : undefined,
    },

  ];
};

export const getTLTableColumns = (t: any, isMobile: any) => {
  return [
    {
      key: "name",
      title: t("FORM.NAME"),
      dataType: DataType.String,
      //sortDirection: SortDirection.Ascend,
       width: isMobile?160:undefined,
    },
    {
      key: "status",
      title: t("FORM.STATUS"),
      dataType: DataType.String,
    //  sortDirection: SortDirection.Ascend,
    width: isMobile?160:undefined,
  },

    {
      key: "age",
      title: t("FORM.AGE"),
      dataType: DataType.String,
      width: isMobile?160:undefined,
    },
    {
      key: "gender",
      title: t("FORM.GENDER"),
      dataType: DataType.String,
      width: isMobile?160:undefined,
    },

    {
      key: "state",
      title: t("FORM.STATE"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: 160,
    },
    {
      key: "district",
      title: t("FORM.DISTRICT"),
      dataType: DataType.String,
      sortDirection: SortDirection.Ascend,
      width: 160,
    },

    {
      key: "blocks",
      title: t("FORM.BLOCK"),
      dataType: DataType.String,
     // sortDirection: SortDirection.Ascend,
     width: isMobile?160:undefined,
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
      title: t("FORM.ACTION"),
      dataType: DataType.String,
      width: isMobile?160:undefined,
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
      key: "customFieldValues",
      title: t("FORM.TYPE_OF_COHORT"),
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
