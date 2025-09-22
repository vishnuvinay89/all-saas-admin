// Utility functions for role-based access control

export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Check if user is super admin
  const isSuperAdmin = localStorage.getItem("superAdminLoggedIn") === "true";
  if (isSuperAdmin) {
    return "super_admin";
  }
  
  // Check user role from localStorage or other sources
  const adminInfo = localStorage.getItem("adminInfo");
  if (adminInfo) {
    try {
      const userInfo = JSON.parse(adminInfo);
      if (userInfo.isSuperAdmin === true) {
        return "super_admin";
      }
      // Check for tenant admin role
      if (userInfo.userRoleTenantMapping?.code === "tenant_admin") {
        return "tenant_admin";
      }
      if (userInfo.userRoleTenantMapping?.code === "cohort_admin") {
        return "cohort_admin";
      }
    } catch (error) {
      console.error("Error parsing admin info:", error);
    }
  }
  
  return "tenant_admin"; // Default fallback
};

export const hasPermission = (requiredRole: string | string[]): boolean => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
};

export const isSuperAdmin = (): boolean => {
  return hasPermission("super_admin");
};

export const isTenantAdmin = (): boolean => {
  return hasPermission(["tenant_admin", "super_admin"]);
};
