import { DataType, SortDirection } from "ka-table";

export const getUserTableColumns = (t: any, isMobile: any) => {

    return [
        {
          key: "name",
          title: t("FORM.NAME"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
          width:isMobile?160:null,

        },
        {
          key: "status",
          title: t("FORM.STATUS"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
           width:isMobile?160:null,
        },
       
      
        {
          key: "age",
          title: t("FORM.AGE"),
          dataType: DataType.String,
          width:isMobile?160:null,
        },
        {
          key: "gender",
          title: t("FORM.GENDER"),
          dataType: DataType.String,
          width:isMobile?160:null,
        },
        {
          key: "mobile",
          title: t("FORM.MOBILE_NUMBER"),
          dataType: DataType.String,
          width:isMobile?160:null,
        },
        {
          key: "state",
          title: t("FORM.STATE"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
          width:isMobile?160:null,
        },
        {
          key: "district",
          title:t("FORM.DISTRICT"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
          width: isMobile?160:null,
        },
      
        {
          key: "blocks",
          title: t("FORM.BLOCK"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
          width:isMobile?160:null,
        },
        {
          key: "centers",
          title:  t("FORM.CENTER"),
          dataType: DataType.String,
          sortDirection: SortDirection.Ascend,
          width: isMobile?160:null,
        },
        {
          key: "actions",
          title: t("FORM.ACTION"),
          dataType: DataType.String,
          width: isMobile?160:null,
        },
      ];
}


export const getTLTableColumns = (t: any, isMobile:any) => {
    return[
       
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
            title:t("FORM.DISTRICT"),
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
}

