import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { getUserApprovalRequests } from "@/services/CohortService/cohortService";
import { showToastMessage } from "@/components/Toastify";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

interface ApprovalRequest {
  approvalId: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  requestType?: string;
  description?: string;
}

const ApprovalStatusContent: React.FC = () => {
  const { t } = useTranslation();
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovalRequests = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      const response = await getUserApprovalRequests();
      
      if (response?.responseCode === 200 && response?.result) {
        console.log(response.result.data);
        setApprovalRequests(response.result.data);
      } else {
        setError("Failed to fetch approval requests");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch approval requests");
      showToastMessage(err.message || "Failed to fetch approval requests", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApprovalRequests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon color="success" />;
      case "rejected":
        return <CancelIcon color="error" />;
      case "pending":
      default:
        return <PendingIcon color="warning" />;
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      pending: { color: "warning" as const, label: "Pending" },
      approved: { color: "success" as const, label: "Approved" },
      rejected: { color: "error" as const, label: "Rejected" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Chip
        icon={getStatusIcon(status)}
        label={config.label}
        color={config.color}
        variant="outlined"
        size="small"
      />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleRefresh = () => {
    fetchApprovalRequests(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {t("APPROVAL.APPROVAL_STATUS_TITLE")}
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh} disabled={refreshing}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {approvalRequests.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <InfoIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t("APPROVAL.NO_REQUESTS_FOUND")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("APPROVAL.NO_REQUESTS_DESCRIPTION")}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("APPROVAL.REQUEST_ID")}</TableCell>
                <TableCell>{t("APPROVAL.STATUS")}</TableCell>
                <TableCell>{t("APPROVAL.REQUEST_TYPE")}</TableCell>
                <TableCell>{t("APPROVAL.CREATED_DATE")}</TableCell>
                <TableCell>{t("APPROVAL.UPDATED_DATE")}</TableCell>
                <TableCell>{t("APPROVAL.DESCRIPTION")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvalRequests.map((request) => (
                <TableRow key={request.approvalId} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {request.approvalId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(request.status)}
                  </TableCell>
                  <TableCell>
                    {request.requestType || t("APPROVAL.TENANT_CREATION")}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(request.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(request.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {request.description || t("APPROVAL.TENANT_CREATION_REQUEST")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {refreshing && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const ApprovalStatus: React.FC = () => {
  return (
    <RoleProtectedRoute requiredRoles={["tenant_admin", "cohort_admin", "super_admin"]}>
      <ApprovalStatusContent />
    </RoleProtectedRoute>
  );
};

export default ApprovalStatus;
