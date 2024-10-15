import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Loader from "@/components/Loader";
import { useTranslation } from "next-i18next";

// @ts-ignore
const Editors = dynamic(() => import("editor/Editor"), { ssr: false });

const Editor = () => {
  const { t } = useTranslation();
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);

  useEffect(() => {
    const loadScriptAndStyles = () => {
      if (!document.getElementById("sunbird-editor-css")) {
        const link = document.createElement("link");
        link.id = "sunbird-editor-css";
        link.rel = "stylesheet";
        link.href =
          "https://cdn.jsdelivr.net/npm/@tekdi/sunbird-questionset-editor-web-component@3.0.1/styles.css";
        document.head.appendChild(link);
      }

      if (!document.getElementById("sunbird-editor-script")) {
        const script = document.createElement("script");
        script.id = "sunbird-editor-script";
        script.src =
          "https://cdn.jsdelivr.net/npm/@tekdi/sunbird-questionset-editor-web-component@3.0.1/sunbird-questionset-editor.js";
        script.async = true;
        script.onload = () => setIsAssetsLoaded(true);
        document.body.appendChild(script);
      } else {
        setIsAssetsLoaded(true); 
      }
    };

    loadScriptAndStyles();
  }, []);

  return (
    <div>
      {isAssetsLoaded ? (
        <Editors />
      ) : (
        <Loader showBackdrop={false} loadingText={t("COMMON.LOADING")} />
      )}
    </div>
  );
};

export default Editor;