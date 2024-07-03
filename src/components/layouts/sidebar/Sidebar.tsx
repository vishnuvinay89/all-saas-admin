
import React from "react";
import NextLink from "next/link";
import PropTypes from "prop-types";
import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from "@mui/material";
import FeatherIcon from "feather-icons-react";
import LogoIcon from "../logo/LogoIcon";
import Menuitems from "./MenuItems";

import Buynow from "./Buynow";
import { useRouter } from "next/router";
import theme from "@/components/theme/theme";
const Sidebar = ({ isMobileSidebarOpen, onSidebarClose, isSidebarOpen, onMenuItemClick }:any) => {
  const [open, setOpen] = React.useState(true);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  let curl = useRouter();
  const location = curl.pathname;

  const SidebarContent = (
<Box 
  p={2} 
  height="100%" 
 //backgroundColor={t.palette.primary.light}
  border={1} 
  borderColor="#ccc" 
>      <LogoIcon />
      <Box mt={2}>
        <List>
          {Menuitems?.map((item, index) => (
            <List component="li" disablePadding key={item.title}>
              <ListItem
                onClick={() => {
                  onMenuItemClick(item.href);
                  onSidebarClose();
                }}
                button
                selected={location === item.href}
                sx={{
                  mb: 1,
                  ...(location === item.href && {
                    color: "white",
                    backgroundColor: (theme) =>
                      `${theme.palette.primary.main}!important`,
                  }),
                }}
              >
                <ListItemIcon>
                  <FeatherIcon
                    style={{
                      color: `${location === item.href ? "white" : ""} `,
                    }}
                    icon={item.icon}
                    width="20"
                    height="20"
                  />
                </ListItemIcon>
                <ListItemText>
                  {item.title}
                </ListItemText>
              </ListItem>
            </List>
          ))}
        </List>
      </Box>
      <Buynow />
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        variant="persistent"
        PaperProps={{
          sx: {
            width: "265px",
            border: "0 !important",
            boxShadow: "0px 7px 30px 0px rgb(113 122 131 / 11%)",
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }
  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      PaperProps={{
        sx: {
          width: "265px",
          border: "0 !important",
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

Sidebar.propTypes = {
  isMobileSidebarOpen: PropTypes.bool,
  onSidebarClose: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
  onMenuItemClick: PropTypes.func,
};

export default Sidebar;
