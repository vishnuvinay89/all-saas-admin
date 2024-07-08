import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ProtectedRoute from "../components/ProtectedRoute";

const ViewPlans = () => {
  const { t } = useTranslation();
  return (
    <ProtectedRoute>
      <>
      <h1>{t("SIDEBAR.VIEW_PLANS")}</h1>
      </>
     
     </ProtectedRoute>
  );
};

export default ViewPlans;
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
