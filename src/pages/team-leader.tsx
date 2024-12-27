import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import UserTable from "@/components/UserTable";
import { useTranslation } from "next-i18next";
import { Role, FormContextType } from "@/utils/app.constant";
import CommonUserModal from "@/components/CommonUserModal";
import useSubmittedButtonStore from "@/utils/useSharedState";

const TeamLeader: React.FC = () => {
  const { t } = useTranslation();
  const handleAddTeamLeaderClick = () => {
    handleOpenAddTeamLeaderModal();
  };
  const [submitValue, setSubmitValue] = React.useState<boolean>(false);
  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );

  const [openAddTeamLeaderModal, setOpenAddTeamLeaderModal] =
    React.useState(false);
  const handleOpenAddTeamLeaderModal = () => {
    setOpenAddTeamLeaderModal(true);
  };
  const handleModalSubmit = (value: boolean) => {
    setSubmitValue(true);
  };
  const handleCloseAddTeamLeaderModal = () => {
    setSubmittedButtonStatus(false);

    setOpenAddTeamLeaderModal(false);
  };

  return (
    <>
      <UserTable
        role={Role.TEAM_LEADER}
        searchPlaceholder={t("TEAM_LEADERS.SEARCHBAR_PLACEHOLDER")}
        userType={t("SIDEBAR.TEAM_LEADERS")}
        handleAddUserClick={handleAddTeamLeaderClick}
        parentState={submitValue}
      />

      {/* <CommonUserModal
        open={openAddTeamLeaderModal}
        onClose={handleCloseAddTeamLeaderModal}
        onSubmit={handleModalSubmit}
        userType={FormContextType.TEAM_LEADER}
      /> */}
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
