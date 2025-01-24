import Keycloak from "keycloak-js";

export const logout = async () => {
  try {
    if (keycloakInstance) {
      await keycloakInstance.logout({
        redirectUri: window.location.origin + "/login",
      });
      console.log(keycloakInstance);

      localStorage.clear();
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || " ",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || " ",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
};

// Initialize Keycloak instance

const keycloakInstance =
  typeof window !== "undefined" ? new Keycloak(keycloakConfig) : null;

export default keycloakInstance;
