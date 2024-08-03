import { useEffect } from "react";
import { useRouter } from "next/router";
import { logout } from "../services/LoginService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Loader from "@/components/Loader";
import { useTranslation } from "react-i18next";

function Logout() {
  const router = useRouter();
  const { t } = useTranslation();
  useEffect(() => {
    const userLogout = async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          await logout(refreshToken);
        }
      } catch (error) {
        console.log(error);
      }
    };
    userLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("preferredLanguage");

    router.replace("/login");
  }, []);

  return <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />;
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Logout;
