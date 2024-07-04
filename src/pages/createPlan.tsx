import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ProtectedRoute from "../components/ProtectedRoute";

const CreatePlan = () => {
  const { t } = useTranslation();

  return (
    <ProtectedRoute>
      <h1>{t("SIDEBAR.CREATE_PLAN")}</h1>
    </ProtectedRoute>
  );
};

export default CreatePlan;
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
