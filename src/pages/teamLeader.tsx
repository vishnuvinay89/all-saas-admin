import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import UserTable from "@/components/UserTable";
import { useTranslation } from "next-i18next";
import { Role } from "@/utils/app.constant";


const TeamLeader: React.FC = () => {
  const { t } = useTranslation();
  const handleAddTeamLeaderClick = () => {
  };
  return (
    <>
      <UserTable role={Role.TEAM_LEADER} searchPlaceholder={ t("TEAM_LEADERS.SEARCHBAR_PLACEHOLDER")} userType={t("SIDEBAR.TEAM_LEADERS")} handleAddUserClick={handleAddTeamLeaderClick}/>
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

export default TeamLeader;
