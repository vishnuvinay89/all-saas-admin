import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import UserTable from "@/components/UserTable";
import { useTranslation } from "next-i18next";
import { Role } from "@/utils/app.constant";
import AddLearnerModal from '@/components/AddLeanerModal';

const Learners: React.FC = () => {
  const { t } = useTranslation();
 const [openAddLearnerModal, setOpenAddLearnerModal] = React.useState(false);
 const handleOpenAddLearnerModal = () => {
  setOpenAddLearnerModal(true);
};

const handleCloseAddLearnerModal = () => {
  setOpenAddLearnerModal(false);
};
  const handleAddLearnerClick = () => {
    handleOpenAddLearnerModal();
  };
  return (
    <>
      <UserTable role={Role.STUDENT} userType={t("SIDEBAR.LEARNERS")} searchPlaceholder={t("LEARNERS.SEARCHBAR_PLACEHOLDER")} handleAddUserClick={handleAddLearnerClick}/>
      <AddLearnerModal
              open={openAddLearnerModal}
              onClose={handleCloseAddLearnerModal}
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

export default Learners;
