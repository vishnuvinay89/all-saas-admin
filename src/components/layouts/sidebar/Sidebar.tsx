
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
  useTheme,
  Collapse
} from "@mui/material";
import FeatherIcon from "feather-icons-react";
import LogoIcon from "../logo/LogoIcon";
import Menuitems from "./MenuItems";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "next-i18next";

import Buynow from "./Buynow";
import { useRouter } from "next/router";
import theme from "@/components/theme/theme";
const Sidebar = ({ isMobileSidebarOpen, onSidebarClose, isSidebarOpen, onMenuItemClick }:any) => {
  const [open, setOpen] = React.useState(true);
  const [indexNum, setIndex] = React.useState(0);
  const { t } = useTranslation();
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const [open2, setOpen2] = React.useState<{ [key: number]: boolean }>({});

  let curl = useRouter();
  const location = curl.pathname;
  const handleClick = (index: number) => {
    setIndex(index);
    setOpen2((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const SidebarContent = (
<Box 
  p={2} 
  height="100%" 
  border={1} 
  borderColor="#ccc" 
  bgcolor={"#F4F4F4"}
>      <LogoIcon />
      <Box mt={2}
      >
        <List>
          {Menuitems?.map((item, index: number) => (
            <List component="li" disablePadding key={item.title}>
              <ListItem
                onClick={() => {
                item.subOptions?null :onMenuItemClick(item.href);
                  onSidebarClose();
                  handleClick(index);
                }}
                button
                selected={indexNum === index}
                sx={{
                  mb: 1,
                  ...(indexNum === index && !item.subOptions  &&{
                    color: "black",
                    backgroundColor: (theme) =>
                       `${theme.palette.primary.dark}`
                     // 'red',
                  }),
                }}
              >
                <ListItemIcon>
                  <FeatherIcon
                    // style={{
                    //   color: `${location === item.href ? "white" : ""} `,
                    // }}
                    icon={item.icon}
                    size="20"
                  />
                </ListItemIcon>
                <ListItemText>
               { t(item.title)}
                </ListItemText>
                {item.subOptions ? (
              open2[index] ? <ExpandMore />:<ExpandLess /> 
            ) : null}




              </ListItem>

              {item.subOptions && (
            <Collapse in={open2[index]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subOptions.map((subItem) => (
                  <ListItem
                    key={subItem.title}
                    button
                    onClick={() => {
                      onMenuItemClick(subItem.href);
                      onSidebarClose();
                    }}
                    selected={location === subItem.href}
                    sx={{
                      pl: 4,
                      ...(location === subItem.href && {
                        color: "white",
                        backgroundColor: (theme) =>
                          `${theme.palette.primary.main}!important`,
                      }),
                    }}
                  >
                    <ListItemText>  { t(subItem.title)}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          )}
              
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
