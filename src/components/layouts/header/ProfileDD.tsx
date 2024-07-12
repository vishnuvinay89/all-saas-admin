import React, { useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
// import userimg from "../../../assets/images/users/user2.jpg";
import sidebarBuynowsvg from "../../../../public/images/users/user2.jpg";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logout from "@/pages/logout";
import { useRouter } from "next/router";

import {
  Box,
  Menu,
  Typography,
  Link,
  ListItemButton,
  List,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import { AnyARecord } from "dns";
const ProfileDD = () => {
  const [anchorEl4, setAnchorEl4] = React.useState(null);
  const [userName, setUserName] = React.useState<string | null>("");
  const router = useRouter();

  const handleClick4 = (event: any) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };
  const handleLogout = () => {
    router.push("/logout");
  };

  const getUserName = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      const name = localStorage.getItem("name");
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
          {/* <Image
            src={AccountCircleIcon}
            alt={"userimg"}
            width="30"
            height="30"
            className="roundedCircle"
          /> */}
          <AccountCircleIcon />
          <Box
            sx={{
              display: {
                // xs: "none",
                sm: "flex",
              },
              alignItems: "center",
            }}
          >
            <Typography variant="h5" fontWeight="400" sx={{ ml: 1 }}>
              Hi,
            </Typography>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                ml: 1,
              }}
            >
              {userName ? userName : "User"}
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
        sx={{
          "& .MuiMenu-paper": {
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
            <Link>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Link>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileDD;
