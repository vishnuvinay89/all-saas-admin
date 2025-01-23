import Keycloak from "keycloak-js";

export const logout = async (router: any) => {
  try {
    if (keycloakInstance) {
      console.log("calling logout");

      await keycloakInstance.logout();
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
      router.replace("/login");
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
};

// Initialize Keycloak instance
const keycloakInstance =
  typeof window !== "undefined" ? new Keycloak(keycloakConfig) : null;

export default keycloakInstance;
