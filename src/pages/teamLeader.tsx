import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ProtectedRoute from '../components/ProtectedRoute';

const TeamLeader = () => {
    const { t } = useTranslation();
  return (
    <ProtectedRoute>
      <h1> {t("SIDEBAR.TEAM_LEADERS")}</h1>
    </ProtectedRoute>
  );
};

export default TeamLeader;
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
