import { Box, Typography, Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import FilterSearchBar from "@/components/FilterSearchBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import FileUploadDialog from "@/components/FileUploadDialog"; // Import the FileUploadDialog component

const FileDetails = () => {
  const router = useRouter();
  const { fileName, subject } = router.query;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility

  useEffect(() => {
    if (fileName) {
      setSelectedFile({ name: fileName } as File);
    }
  }, [fileName]);

  const handleBackClick = () => {
    router.back();
  };

  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(
      () => {
        alert("Link copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy link: ", err);
      }
    );
  };

  const handleImportClick = () => {
    setDialogOpen(true); // Open the dialog
  };

  const handleRemoveFile = () => {
    setSelectedFile(null); // Clear the selected file
  };

  const handleDownloadFile = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleUpload = () => {
    if (selectedFile) {
      router.push({
        pathname: "/csvDetails",
        query: {
          fileName: selectedFile.name,
        },
      });
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <IconButton onClick={handleBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">{subject || "Subject"}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: "8px",
              backgroundColor: "#000000",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
            onClick={handleImportClick} // Open dialog
          >
            Import CSV
          </Button>
          <Button
            sx={{
              borderRadius: "8px",
              color: "#000000",
              borderColor: "#000000",
              "&:hover": {
                borderColor: "#333333",
                color: "#333333",
              },
            }}
            onClick={handleCopyLink}
          >
            <AttachmentIcon />
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#E5E5E5",
          width: "100%",
          height: "40px",
          marginRight: "16px",
          justifyContent: "space-between",
          padding: "8px 16px",
          borderRadius: "8px",
          mb: "30px",
        }}
      >
        <Typography
          sx={{ fontWeight: "bold", color: "#000000", padding: "8px" }}
          variant="h3"
        >
          {selectedFile ? `File: ${selectedFile.name}` : "No file selected"}
        </Typography>
        <Box>
          <Button
            sx={{
              backgroundColor: "white",
              color: "black",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#f0f0f0",
                color: "black",
              },
            }}
            onClick={handleRemoveFile}
            disabled={!selectedFile} // Disable if no file is selected
          >
            Remove
          </Button>
          <Button
            onClick={handleDownloadFile}
            disabled={!selectedFile} // Disable if no file is selected
          >
            <ArrowDownwardIcon
              sx={{
                cursor: selectedFile ? "pointer" : "default",
              }}
            />
          </Button>
        </Box>
      </Box>
      <FilterSearchBar
        grade=""
        medium=""
        searchQuery=""
        handleGradeChange={() => {}}
        handleMediumChange={() => {}}
        handleSearchChange={() => {}}
        selectedOption=""
        handleDropdownChange={() => {}}
        card={undefined}
        selectFilter={undefined}
        onBackClick={() => {}}
        showGradeMedium={false}
        showFoundaitonCourse={false}
      />
      <Box>
        <Typography variant="h3">Topic Details</Typography>
      </Box>
      <FileUploadDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onFileChange={handleFileChange}
        selectedFile={selectedFile}
        onRemoveFile={handleRemoveFile} // Add this prop
        onUpload={handleUpload} // Add this prop
      />{" "}
    </Box>
  );
};

export default FileDetails;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
