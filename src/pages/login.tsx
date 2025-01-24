import {
  Box,
  useMediaQuery, // Import useMediaQuery hook
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import ReactGA from "react-ga4";
import Loader from "../components/Loader";
import { getUserId, login } from "../services/LoginService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { telemetryFactory } from "@/utils/telemetry";
import { logEvent } from "@/utils/googleAnalytics";
import { showToastMessage } from "@/components/Toastify";
import { useUserIdStore } from "@/store/useUserIdStore";
import { getUserDetailsInfo } from "@/services/UserList";
import { Storage } from "@/utils/app.constant";
import useSubmittedButtonStore from "@/utils/useSharedState";
import { Role } from "@/utils/app.constant";

const LoginPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(lang);
  const [language, setLanguage] = useState(selectedLanguage);
  const [adminInfo, setAdminInfo] = useState();

  const theme = useTheme<any>();
  const router = useRouter();
  const { setUserId } = useUserIdStore();
  const setAdminInformation = useSubmittedButtonStore(
    (state: any) => state.setAdminInformation
  );

  // Use useMediaQuery to detect screen size
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const passwordRef = useRef<HTMLInputElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const preferredLang = localStorage.getItem("preferredLanguage") || "en";
      setLanguage(preferredLang);
      setLang(preferredLang);

      const token = localStorage.getItem("token");
      if (token) {
        router.push("/tenant");
      }
    }
  }, []);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const trimmedValue = value.trim();
    setUsername(trimmedValue);
    setUsernameError(/\s/.test(trimmedValue));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
    logEvent({
      action: "show-password-icon-clicked",
      category: "Login Page",
      label: "Show Password",
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // const fetchUserDetail = async () => {
  //   let userId;
  //   try {
  //     if (typeof window !== "undefined" && window.localStorage) {
  //       userId = localStorage.getItem(Storage.USER_ID);
  //     }
  //     const fieldValue = true;
  //     if (userId) {
  //       console.log("true");
  //       const response = await getUserDetailsInfo(userId, fieldValue);

  //       const userInfo = response?.userData;
  //       //set user info in zustand store
  //       setAdminInformation(userInfo);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserDetail();
  // }, []);
  const fetchUserDetail = async () => {
    let userId;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        userId = localStorage.getItem(Storage.USER_ID);
      }
      const fieldValue = true;
      if (userId) {
        const response = await getUserDetailsInfo(userId, fieldValue);

        const userInfo = response?.userData;
        setAdminInfo(userInfo);
        //set user info in zustand store
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("adminInfo", JSON.stringify(userInfo));
          localStorage.setItem("stateName", userInfo?.customFields[0]?.value);
        }

        if (userInfo.tenantData?.[0]?.roleName === Role.LOGIN_LEARNER) {
          const errorMessage = t("LOGIN_PAGE.ACCESS_DENIED");
          showToastMessage(errorMessage, "error");
          localStorage.removeItem("token");
        } else {
          setAdminInformation(userInfo);
          router.push("/tenant");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    logEvent({
      action: "login-button-clicked",
      category: "Login Page",
      label: "Login Button Clicked",
    });
    if (!usernameError && !passwordError) {
      setLoading(true);
      try {
        const response = await login({ username, password });
        if (response) {
          if (typeof window !== "undefined" && window.localStorage) {
            const token = response?.result?.access_token;
            const refreshToken = response?.result?.refresh_token;
            localStorage.setItem("token", token);
            rememberMe
              ? localStorage.setItem("refreshToken", refreshToken)
              : localStorage.removeItem("refreshToken");

            const userResponse = await getUserId();
            localStorage.setItem("userId", userResponse?.userId);
            setUserId(userResponse?.userId || "");

            localStorage.setItem("name", userResponse?.name);
            const tenantId = userResponse?.tenantData?.[0]?.tenantId;
            localStorage.setItem("tenantId", tenantId);
          }
        }
        setLoading(false);
        const telemetryInteract = {
          context: { env: "sign-in", cdata: [] },
          edata: {
            id: "login-success",
            type: "CLICK",
            pageid: "sign-in",
            uid: localStorage.getItem("userId") || "Anonymous",
          },
        };
        telemetryFactory.interact(telemetryInteract);
        fetchUserDetail();
      } catch (error: any) {
        setLoading(false);
        const errorMessage = t("LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT");
        showToastMessage(errorMessage, "error");
      }
    }
  };

  const isButtonDisabled =
    !username || !password || usernameError || passwordError;

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value;
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("preferredLanguage", newLocale);
      setLanguage(newLocale);
      ReactGA.event("select-language-login-page", {
        selectedLanguage: newLocale,
      });
      router.push("/login", undefined, { locale: newLocale });
    }
  };

  const handleForgotPasswordClick = () => {
    logEvent({
      action: "forgot-password-link-clicked",
      category: "Login Page",
      label: "Forgot Password Link Clicked",
    });
  };

  return (
    <Box sx={{ backgroundColor: "white", height: "100vh" }}>
      {true && <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />}
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      noLayout: true,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default LoginPage;
