import React, { useEffect } from "react";
import FeatherIcon from "feather-icons-react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTranslation } from "next-i18next";

import { useRouter } from "next/router";
import {
  Box,
  Menu,
  Typography,
  ListItemButton,
  List,
  ListItemText,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import { Storage } from "@/utils/app.constant";
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import { getUserDetails } from "@/services/UserList";

const Profile = () => {
  const [anchorEl4, setAnchorEl4] = React.useState<null | HTMLElement>(null);
  const [userName, setUserName] = React.useState<string | null>("");
  const [mobile, setMobile] = React.useState<string | null>("");
  const [email, setEmail] = React.useState<string | null>("");
  const { t } = useTranslation();


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


    const fetchUserDetail = async () => {
  //    let userId;
  //    try{
  //     if (typeof window !== "undefined" && window.localStorage) {
  //        userId = localStorage.getItem(Storage.USER_ID);
  //     }  
  //    if(userId)   
  //     {
  //       const response=await getUserDetails(userId)
  //        console.log(response)
  //     } 
    
  
  //   fetchUserDetail();
  //    }
  //    catch(error)
  // {

  // }
  }
  
    
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
              {userName
                ? userName.charAt(0).toUpperCase() +
                  userName.slice(1).toLowerCase()
                : ""}
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
      <Box sx={{ 
    //  backgroundColor: 'ivory', 
      padding: '20px', 
      borderRadius: '10px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center'
    }}>
      <Box sx={{ 
        backgroundColor: '#FFC107', 
        padding: '10px', 
        borderRadius: '50%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          VS
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ marginBottom: '10px' }}>
        Vivek Shah
      </Typography>
      <Typography variant="subtitle1" sx={{ marginBottom: '20px' }}>
        Admin
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <PhoneIcon sx={{ marginRight: '10px' }} />
        <Typography variant="body1">
          4038402420
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <MailIcon sx={{ marginRight: '10px' }} />
        <Typography variant="body1">
          vivek.shah123@email.com
        </Typography>
      </Box>
      <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogout}
              sx={{ fontSize: "16px" }}
            >
             {t("COMMON.LOGOUT")} 
            </Button>
      {/* <IconButton sx={{ marginLeft: '10px' }}>
          <EditIcon />
        </IconButton> */}
    </Box>
      </Menu>



      
    </>
  );
};

export default Profile;
