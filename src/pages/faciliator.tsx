import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import UserTable from "@/components/UserTable";
import { useTranslation } from "next-i18next";
import { Role } from "@/utils/app.constant";
import AddFacilitatorModal from "@/components/AddFacilitator";
const Faciliator: React.FC = () => {
  const { t } = useTranslation();
  const [openAddFacilitatorModal,  setOpenAddFacilitatorModal] = React.useState(false);
 const handleOpenAddFacilitatorModal = () => {
  setOpenAddFacilitatorModal(true);
};

const handleCloseAddFacilitatorModal = () => {
  setOpenAddFacilitatorModal(false);
};

  const handleAddFaciliatorClick = () => {
    handleOpenAddFacilitatorModal();
  };
  return (
    <>
      <UserTable role={Role.TEACHER} userType= {t("SIDEBAR.FACILITATORS")} searchPlaceholder={ t("FACILITATORS.SEARCHBAR_PLACEHOLDER")}handleAddUserClick={handleAddFaciliatorClick} ParentState={openAddFacilitatorModal}/>
      <AddFacilitatorModal
              open={openAddFacilitatorModal}
              onClose={handleCloseAddFacilitatorModal}
            />
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
