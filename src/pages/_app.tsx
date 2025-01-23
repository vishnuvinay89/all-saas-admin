// import "@/styles/globals.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { initGA } from "../utils/googleAnalytics";
import { useEffect, useState } from "react";
import { AuthProvider } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { telemetryFactory } from "../utils/telemetry";
import FullLayout from "@/components/layouts/FullLayout";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import customTheme from "../styles/customTheme";
import "./../styles/style.css";
import keycloak from "../utils/keycloak";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "react-circular-progressbar/dist/styles.css";
import { log } from "console";
import { useRouter } from "next/router";

function App({ Component, pageProps }: AppProps) {
  const [isLogin, setLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const router = useRouter();

  // Analytics initialization
  useEffect(() => {
    telemetryFactory.init();
  }, []);

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA(`G-6NVMB20J4Z`);
      window.GA_INITIALIZED = true;
    }
  }, []);

  // Keycloak initialization
  useEffect(() => {
    const initializeKeycloak = async () => {
      try {
        if (!keycloak.authenticated) {
          const authenticated = await keycloak.init({
            onLoad: "login-required",
          });

          setLogin(authenticated);

          if (authenticated) {
            setAccessToken(keycloak.token);
            localStorage.setItem("token", keycloak.token);
            localStorage.setItem("refreshToken", keycloak.refreshToken);

            try {
              const profile = await keycloak.loadUserProfile();
              setUserInfo(profile);
              // router.push("/tenant");
            } catch (err) {
              console.error("Failed to load user profile:", err);
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize Keycloak:", error);
      }
    };

    initializeKeycloak();
  }, []);

  const renderComponent = () => {
    if (pageProps.noLayout) {
      return <Component {...pageProps} />;
    } else {
      return (
        <FullLayout>
          <Component {...pageProps} />
        </FullLayout>
      );
    }
  };

  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: 1000 * 60 * 60 * 24,
          staleTime: 1000 * 60 * 60 * 24,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <CssVarsProvider theme={customTheme}>
          {renderComponent()}
          <ToastContainer
            position="bottom-left"
            autoClose={3000}
            stacked={false}
          />
        </CssVarsProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
