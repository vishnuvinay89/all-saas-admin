import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { hasPermission } from '../utils/roleUtils';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: string | string[];
  fallbackPath?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  requiredRoles,
  fallbackPath = '/tenant'
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  // Check if user has required role
  const hasRequiredRole = hasPermission(requiredRoles);

  React.useEffect(() => {
    if (!hasRequiredRole) {
      router.push(fallbackPath);
    }
  }, [hasRequiredRole, router, fallbackPath]);

  if (!hasRequiredRole) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
        p={3}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {t("ROLE_PROTECTION.ACCESS_DENIED")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {t("ROLE_PROTECTION.INSUFFICIENT_PERMISSIONS")}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push(fallbackPath)}
        >
          {t("ROLE_PROTECTION.GO_BACK")}
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
