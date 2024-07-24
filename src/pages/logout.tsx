import { useEffect } from "react";
import { useRouter } from "next/router";
import { logout } from "../services/LoginService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function Logout() {
  const router = useRouter();
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

    router.replace("/login");
  }, []);

  return "";
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Logout;
