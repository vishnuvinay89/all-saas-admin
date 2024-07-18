import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import UserTable from "@/components/UserTable";
import { useTranslation } from "next-i18next";
import { Role } from "@/utils/app.constant";

const Learners: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <UserTable role={Role.STUDENT} userType={t("SIDEBAR.LEARNERS")} searchPlaceholder={t("LEARNERS.SEARCHBAR_PLACEHOLDER")}/>
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

export default Learners;
