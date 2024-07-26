import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
  onUpload: () => void;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  onFileChange,
  selectedFile,
  onRemoveFile,
  onUpload,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ position: "relative" }}>
        <Typography variant="h2">Import Planner</Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: "16px",
            top: "16px",
            color: "#000000",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Divider sx={{ marginTop: "16px" }} />
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <IconButton
            sx={{
              borderRadius: "8px",
              borderColor: "#1E1B16",
              color: "#1E1B16",
              "&:hover": {
                borderColor: "#1E1B16",
                color: "#1E1B16",
              },
            }}
            component="label"
          >
            <UploadIcon />
            <input type="file" hidden accept=".csv" onChange={onFileChange} />
          </IconButton>
          <Button
            variant="outlined"
            component="label"
            sx={{
              borderRadius: "8px",
              padding: "8px 16px",
              borderColor: "black",
              color: "black",
              "&:hover": {
                borderColor: "black",
                color: "black",
              },
            }}
          >
            Browse Files
            <input type="file" hidden accept=".csv" onChange={onFileChange} />
          </Button>
          {selectedFile && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "16px",
                padding: "8px",
                borderRadius: "8px",
                backgroundColor: "#f0f0f0",
              }}
            >
              <FileCopyIcon sx={{ color: "#2196F3" }} />
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {selectedFile.name}
              </Typography>
              <IconButton onClick={onRemoveFile}>
                <CloseIcon sx={{ color: "#2196F3" }} />
              </IconButton>
            </Box>
          )}
          <Button
            variant="contained"
            sx={{
              width: "100%",
              borderRadius: "8px",
              backgroundColor: "#000000",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#333333",
              },
              marginTop: "16px",
            }}
            onClick={onUpload}
          >
            Upload
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
