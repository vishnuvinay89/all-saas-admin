import React, { useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import {
  Box,
  Menu,
  Typography,
  ListItemButton,
  List,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import { Storage } from "@/utils/app.constant";

const Profile = () => {
  const [anchorEl4, setAnchorEl4] = React.useState<null | HTMLElement>(null);
  const [userName, setUserName] = React.useState<string | null>("");
  const router = useRouter();

  const handleClick4 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("token");
    }
    router.push("/logout");
  };

  const getUserName = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      const name = localStorage.getItem(Storage.NAME);
      setUserName(name);
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  return (
    <>
      <Button
        aria-label="menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick4}
      >
        <Box display="flex" alignItems="center" color="white">
          <AccountCircleIcon />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 1,
            }}
          >
            <Typography
              variant="body1"
              fontWeight="400"
              sx={{ fontSize: "16px" }}
            >
              Hi,
            </Typography>
            <Typography
              variant="body1"
              fontWeight="700"
              sx={{
                ml: 1,
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "16px",
                whiteSpace: "nowrap",
              }}
            >
              {userName ? userName : ""}
            </Typography>
            <FeatherIcon icon="chevron-down" size="20" />
          </Box>
        </Box>
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl4}
        keepMounted
        open={Boolean(anchorEl4)}
        onClose={handleClose4}
        PaperProps={{
          sx: {
            width: "385px",
          },
        }}
      >
        <Box>
          <Box p={2} pt={0}>
            <List
              component="nav"
              aria-label="secondary mailbox folder"
              onClick={handleClose4}
            >
              <ListItemButton>
                <ListItemText primary="Edit Profile" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Account" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Change Password" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="My Settings" />
              </ListItemButton>
            </List>
          </Box>
          <Divider />
          <Box p={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogout}
              sx={{ fontSize: "16px" }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default Profile;
