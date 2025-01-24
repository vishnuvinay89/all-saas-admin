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

function App({ Component, pageProps }: AppProps) {
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
        if (keycloak != null && !keycloak.authenticated) {
          const authenticated = await keycloak.init({
            onLoad: "login-required",
            redirectUri: window.location.origin + "/tenant",
          });

          if (authenticated) {
            if (keycloak.token) {
              localStorage.setItem("token", keycloak.token);
            }
            if (keycloak.refreshToken) {
              localStorage.setItem("refreshToken", keycloak.refreshToken);
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
