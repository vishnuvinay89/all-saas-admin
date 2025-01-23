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
  url: "https://all-saas-keycloak.tekdinext.com/auth",
  realm: "ALL-SaaS",
  clientId: "ALL-SaaS",
};

// Initialize Keycloak instance
const keycloakInstance =
  typeof window !== "undefined" ? new Keycloak(keycloakConfig) : null;

export default keycloakInstance;
