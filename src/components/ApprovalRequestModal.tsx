import * as React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { createApprovalRequest } from "@/services/CohortService/cohortService";
import { showToastMessage } from "./Toastify";

interface ApprovalRequestModalProps {
  open: boolean;
  onClose: () => void;
  errorMessage?: string;
}

const ApprovalRequestModal: React.FC<ApprovalRequestModalProps> = ({
  open,
  onClose,
  errorMessage,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [approvalId, setApprovalId] = useState<string>("");

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 3,
  };

  const handleSendApprovalRequest = async () => {
    setLoading(true);
    try {
      const response = await createApprovalRequest();
      
      if (response?.responseCode === 201 && response?.result) {
        setApprovalRequested(true);
        setApprovalId(response.result.approvalId);
        showToastMessage(
          response.params?.successmessage || "Approval request sent successfully",
          "success"
        );
      } else if (response?.responseCode === 400) {
        // Handle case where user already has a pending request
        const errorMsg = response?.params?.err || "You already have a pending approval request";
        showToastMessage(errorMsg, "warning");
        
        // Show the existing request info
        setApprovalRequested(true);
        setApprovalId("EXISTING_REQUEST");
      } else {
        showToastMessage("Failed to send approval request", "error");
      }
    } catch (error: any) {
      showToastMessage(
        error.message || "Failed to send approval request",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setApprovalRequested(false);
    setApprovalId("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="approval-modal-title"
      aria-describedby="approval-modal-description"
    >
      <Box sx={style}>
        {!approvalRequested ? (
          <>
            <Typography
              id="approval-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              {t("APPROVAL.APPROVAL_REQUIRED")}
            </Typography>
            
            <Typography
              id="approval-modal-description"
              sx={{ mb: 3, color: "text.secondary" }}
            >
              {errorMessage || 
                t("APPROVAL.APPROVAL_REQUIRED_MESSAGE")}
            </Typography>

            <Box
              sx={{
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                {t("APPROVAL.WHAT_HAPPENS_NEXT")}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                • {t("APPROVAL.ADMIN_WILL_REVIEW")}
                <br />
                • {t("APPROVAL.YOU_WILL_BE_NOTIFIED")}
                <br />
                • {t("APPROVAL.APPROVAL_STATUS_TRACKING")}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={loading}
                sx={{ minWidth: 100 }}
              >
                {t("COMMON.CANCEL")}
              </Button>
              <Button
                variant="contained"
                onClick={handleSendApprovalRequest}
                disabled={loading}
                sx={{ minWidth: 150 }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  t("APPROVAL.SEND_REQUEST")
                )}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography
              variant="h6"
              component="h2"
              sx={{ mb: 2, fontWeight: 600, color: approvalId === "EXISTING_REQUEST" ? "warning.main" : "success.main" }}
            >
              {approvalId === "EXISTING_REQUEST" ? t("APPROVAL.EXISTING_REQUEST_FOUND") : t("APPROVAL.REQUEST_SENT_SUCCESSFULLY")}
            </Typography>
            
            <Typography sx={{ mb: 2 }}>
              {approvalId === "EXISTING_REQUEST" ? t("APPROVAL.EXISTING_REQUEST_MESSAGE") : t("APPROVAL.REQUEST_SUBMITTED_MESSAGE")}
            </Typography>

            {approvalId && approvalId !== "EXISTING_REQUEST" && (
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#e8f5e8",
                  borderRadius: 1,
                  mb: 3,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t("APPROVAL.REQUEST_ID")}: {approvalId}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                  {t("APPROVAL.SAVE_REQUEST_ID")}
                </Typography>
              </Box>
            )}

            {approvalId === "EXISTING_REQUEST" && (
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#fff3cd",
                  borderRadius: 1,
                  mb: 3,
                  border: "1px solid #ffeaa7",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, color: "#856404" }}>
                  {t("APPROVAL.CHECK_STATUS_MESSAGE")}
                </Typography>
                <Typography variant="body2" sx={{ color: "#856404", mt: 1 }}>
                  {t("APPROVAL.NAVIGATE_TO_STATUS")}
                </Typography>
              </Box>
            )}

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleClose}
                sx={{ minWidth: 100 }}
              >
                {t("COMMON.OKAY")}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ApprovalRequestModal;
