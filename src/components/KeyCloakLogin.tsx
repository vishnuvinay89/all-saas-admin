import { Button } from "@mui/material";
import React from "react";

const KeyCloakLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href =
      "https://all-saas-keycloak.tekdinext.com/auth/realms/ALL-SaaS/protocol/openid-connect/auth?client_id=ALL-SaaS&response_type=code";
  };

  return <Button onClick={handleGoogleLogin}>Sign in with Google</Button>;
};

export default KeyCloakLogin;
