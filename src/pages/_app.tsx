import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { initGA } from "../utils/googleAnalytics";
import { useEffect } from "react";
import { AuthProvider } from '../context/AuthContext';

import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
  useTheme,
} from "@mui/material/styles";
import customTheme from "../styles/customTheme";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA(`G-6NVMB20J4Z`);
      window.GA_INITIALIZED = true;
    }
  });
  return (
    <AuthProvider>
    <CssVarsProvider theme={customTheme}>
      <Component {...pageProps} />;
    </CssVarsProvider>
    </AuthProvider>

  );
}

export default appWithTranslation(App);
