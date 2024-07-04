// import React, { useState } from "react";
// import NextLink from "next/link";
// import PropTypes from "prop-types";
// import {
//   Box,
//   Drawer,
//   useMediaQuery,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
// } from "@mui/material";
// import FeatherIcon from "feather-icons-react";
// import LogoIcon from "../logo/LogoIcon";
// import Menuitems from "./MenuItems";
// import Buynow from "./Buynow";
// import { useRouter } from "next/router";
// import theme from "@/components/theme/theme";
// import { makeStyles } from "@material-ui/core/styles";
// import { ExpandLess, ExpandMore } from "@mui/icons-material";
// import { useTranslation } from "next-i18next";

// import { Theme } from "react-toastify";
// const useStyles = makeStyles({
//   link: {
//     textDecoration: "none",
//     color: "inherit",
//     cursor: "pointer",
//   },
// });
// const Sidebar = ({
//   isMobileSidebarOpen,
//   onSidebarClose,
//   isSidebarOpen,
// }: any) => {
//   const [open, setOpen] = React.useState(true);
//   const [open2, setOpen2] = React.useState<{ [key: number]: boolean }>({});

//   const classes = useStyles();
//   const { t } = useTranslation();

//   const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

//   const handleClick = (index: any) => {
//     if (open === index) {
//       setOpen((prevopen) => !prevopen);
//     } else {
//       setOpen(index);
//     }
//   };
//   let curl = useRouter();
//   const location = curl.pathname;

//   const SidebarContent = (
//     <Box p={2} height="100%">
//       <LogoIcon />
//       <Box mt={2}>
//         <List>
//           {Menuitems.map((item, index) => (
//             <List component="li" disablePadding key={item.title}>
//               <NextLink href={item.href} legacyBehavior>
//                 <a className={classes.link}>
//                   <ListItem
//                     onClick={() => {
//                       item.subOptions ? null : handleClick(index);
//                     }}
//                     button
//                     selected={location === item.href}
//                     sx={{
//                       mb: 1,
//                       ...(location === item.href && {
//                         color: "white",
//                         backgroundColor: (theme) =>
//                           `${theme.palette.primary.main}!important`,
//                       }),
//                     }}
//                   >
//                     <ListItemIcon>
//                       <FeatherIcon
//                         // style={{
//                         //   color: `${location === item.href ? "white" : ""} `,
//                         // }}
//                         icon={item.icon}
//                         // width="20"
//                         // height="20"
//                       />
//                     </ListItemIcon>

//                     <ListItemText onClick={onSidebarClose}>
//                       {t(item.title)}
//                     </ListItemText>
//                     {/* {item.subOptions ? (
//                       open2[index] ? (
//                         <ExpandMore />
//                       ) : (
//                         <ExpandLess />
//                       )
//                     ) : null} */}
//                   </ListItem>
//                 </a>
//               </NextLink>

//               {item.subOptions && (
//                 <List component="div" disablePadding>
//                   {item.subOptions.map((subItem) => (
//                     <NextLink
//                       href={subItem.href}
//                       legacyBehavior
//                       key={subItem.title}
//                     >
//                       <a className={classes.link}>
//                         <ListItem
//                           onClick={() => handleClick(index)}
//                           button
//                           selected={location === subItem.href}
//                           sx={{
//                             pl: 4, // Add some padding to differentiate subitems
//                             mb: 1,
//                             ...(location === subItem.href && {
//                               color: "white",
//                               backgroundColor: (theme) =>
//                                 `${theme.palette.primary.main}!important`,
//                             }),
//                           }}
//                         >
//                           <ListItemText onClick={onSidebarClose}>
//                             {t(subItem.title)}
//                           </ListItemText>
//                         </ListItem>
//                       </a>
//                     </NextLink>
//                   ))}
//                 </List>
//               )}
//             </List>
//           ))}
//         </List>
//       </Box>

//       <Buynow />
//     </Box>
//   );
//   if (lgUp) {
//     return (
//       <Drawer
//         anchor="left"
//         open={isSidebarOpen}
//         variant="persistent"
//         PaperProps={{
//           sx: {
//             width: "265px",
//             border: "0 !important",
//             boxShadow: "0px 7px 30px 0px rgb(113 122 131 / 11%)",
//           },
//         }}
//       >
//         {SidebarContent}
//       </Drawer>
//     );
//   }
//   return (
//     <Drawer
//       anchor="left"
//       open={isMobileSidebarOpen}
//       onClose={onSidebarClose}
//       PaperProps={{
//         sx: {
//           width: "265px",
//           border: "0 !important",
//         },
//       }}
//       variant="temporary"
//     >
//       {SidebarContent}
//     </Drawer>
//   );
// };

// Sidebar.propTypes = {
//   isMobileSidebarOpen: PropTypes.bool,
//   onSidebarClose: PropTypes.func,
//   isSidebarOpen: PropTypes.bool,
// };

// export default Sidebar;



import React, { useState } from "react";
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
  Collapse,
} from "@mui/material";
import FeatherIcon from "feather-icons-react";
import LogoIcon from "../logo/LogoIcon";
import Menuitems from "./MenuItems";
import Buynow from "./Buynow";
import { useRouter } from "next/router";
import theme from "@/components/theme/theme";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useTranslation } from "next-i18next";

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
  },
});

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: any) => {
  const [open2, setOpen2] = React.useState<{ [key: number]: boolean }>({});

  const classes = useStyles();
  const { t } = useTranslation();

  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

  const handleClick = (index: any) => {
    setOpen2((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  let router = useRouter();
  const location = router.pathname;

  const SidebarContent = (
    <Box p={2} height="100%">
      <LogoIcon />
      <Box mt={2}>
        <List>
          {Menuitems.map((item, index) => (
            <List component="li" disablePadding key={item.title}>
              <ListItem
                button
                onClick={() => {
                  if (item.subOptions) {
                    handleClick(index);
                  } else {
                    router.push(item.href);
                    onSidebarClose();
                  }
                }}
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
                    icon={item.icon}
                  />
                </ListItemIcon>

                <ListItemText>
                  {t(item.title)}
                </ListItemText>
                {item.subOptions ? (
                  open2[index] ? <ExpandLess /> : <ExpandMore />
                ) : null}
                
              </ListItem>

              {item.subOptions && (
                <Collapse in={open2[index]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subOptions.map((subItem) => (
                      <NextLink href={subItem.href} legacyBehavior key={subItem.title}>
                        <a className={classes.link}>
                          <ListItem
                            button
                           // onClick={onSidebarClose}
                            selected={location === subItem.href}
                            sx={{
                              pl: 4, // Add some padding to differentiate subitems
                              mb: 1,
                              ...(location === subItem.href && {
                                color: "white",
                                backgroundColor: (theme) =>
                                  `${theme.palette.primary.main}!important`,
                              }),
                            }}
                          >
                            <ListItemText>{t(subItem.title)}</ListItemText>
                          </ListItem>
                        </a>
                      </NextLink>
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
};

export default Sidebar;
