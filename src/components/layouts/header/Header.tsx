import React, { useEffect, useRef, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import config from "../../../../config.json";
import PropTypes from "prop-types";
// Dropdown Component
import SearchBar from "./SearchBar";
import { useRouter } from 'next/router';

import {
  Button,
  FormControl,
  TextField,
  Grid,
  Typography,
  useMediaQuery, 
  // Import useMediaQuery hook
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { createTheme } from "@mui/material/styles";
import Profile from "./Profile";

const Header = ({ sx, customClass, toggleMobileSidebar, position }: any) => {
  const { t } = useTranslation();
  const theme = createTheme();
  const [lang, setLang] = useState("");
  const router = useRouter();

  const [selectedLanguage, setSelectedLanguage] = useState(lang);

  const [language, setLanguage] = useState(selectedLanguage);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const lang = localStorage.getItem('preferredLanguage') || 'en';
      setLanguage(lang);
   
    }
  }, [setLanguage]);

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value;
    setLanguage(newLocale);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('preferredLanguage', newLocale);
      router.replace(router.pathname, router.asPath, { locale: newLocale });
    }
  };

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
        {/* <SearchBar
          placeholder={t("NAVBAR.SEARCHBAR_PLACEHOLDER")}
          backgroundColor={theme.palette.background.default}
        /> */}
        {/* ------------ End Menu icon ------------- */}

        <Box flexGrow={1} />

        <Box
        
          sx={{
            display: "flex",
            gap:"10px"
          }}
        >
        <FormControl   >
              <Select
                className="SelectLanguages"
                value={language}
                onChange={handleChange}
                displayEmpty
                sx={{
                  borderRadius: "0.5rem",
                  width: "117px",
                  height: "32px",
                  marginBottom: "0rem",
                  fontSize: "14px",
                  backgroundColor: 'white',

                }}
              >
                {config.languages.map((lang) => (
                  <MenuItem value={lang.code} key={lang.code}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
       
        <Profile />
        </Box>
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
