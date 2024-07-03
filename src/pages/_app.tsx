// import "@/styles/globals.css";















// import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { initGA } from "../utils/googleAnalytics";
import { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { telemetryFactory } from "../utils/telemetry";
import FullLayout from "@/components/layouts/FullLayout";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material/styles";
import customTheme from "../styles/customTheme";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    telemetryFactory.init();
  }, []);
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA(`G-6NVMB20J4Z`);
      window.GA_INITIALIZED = true;
    }
  });

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

  return (
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
  );
}

export default appWithTranslation(App);
