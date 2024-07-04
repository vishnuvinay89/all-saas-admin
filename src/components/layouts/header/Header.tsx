import React from "react";
import FeatherIcon from "feather-icons-react";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import PropTypes from "prop-types";
// Dropdown Component
import SearchBar from "./SearchBar";

import { useTranslation } from "next-i18next";
import ProfileDD from "./ProfileDD";
import { createTheme } from '@mui/material/styles';

const Header = ({ sx, customClass, toggleMobileSidebar, position }:any) => {
  const { t } = useTranslation();
  const theme = createTheme();

  return (
    <AppBar sx={sx} position={position} elevation={0} className={customClass}>
      <Toolbar>
        <IconButton
          size="large"
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "flex",
            },
          }}
        >
          <FeatherIcon icon="menu" size="20" />
        </IconButton>
        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        <SearchBar placeholder={ t("NAVBAR.SEARCHBAR_PLACEHOLDER")} backgroundColor={theme.palette.background.default}/>
        {/* ------------ End Menu icon ------------- */}

        <Box flexGrow={1} />

        <ProfileDD />
        {/* ------------------------------------------- */}
        {/* Profile Dropdown */}
        {/* ------------------------------------------- */}
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  customClass: PropTypes.string,
  position: PropTypes.string,
  toggleSidebar: PropTypes.func,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;
