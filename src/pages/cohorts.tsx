import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ProtectedRoute from "../components/ProtectedRoute";

const Cohorts = () => {
  const { t } = useTranslation();
  return (
    <ProtectedRoute>
      <>
      <h1>{t("SIDEBAR.COHORTS")}</h1>
</>
    </ProtectedRoute>
  );
};

export default Cohorts;
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
