import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import UserTable from "@/components/UserTable";
import { useTranslation } from "next-i18next";
import { Role } from "@/utils/app.constant";

const Faciliator: React.FC = () => {
  const { t } = useTranslation();
  const handleAddFaciliatorClick = () => {
  };
  return (
    <>
      <UserTable role={Role.TEACHER} userType= {t("SIDEBAR.FACILITATORS")} searchPlaceholder={ t("FACILITATORS.SEARCHBAR_PLACEHOLDER")}handleAddUserClick={handleAddFaciliatorClick}/>
    
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Faciliator;
