import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ProtectedRoute from "../components/ProtectedRoute";

const Learners = () => {
  const { t } = useTranslation();
  return (
    <ProtectedRoute>
    <>
          <h1>{t("SIDEBAR.LEARNERS")}</h1>
</>
    </ProtectedRoute>
  );
};

export default Learners;
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
