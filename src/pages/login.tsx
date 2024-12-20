import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Grid,
  Typography,
  useMediaQuery, // Import useMediaQuery hook
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ReactGA from "react-ga4";
import Checkbox from "@mui/material/Checkbox";
import Image from "next/image";
import Loader from "../components/Loader";
import MenuItem from "@mui/material/MenuItem";
import appLogo from "../../public/logo.png";
import config from "../../config.json";
import { getUserId, login } from "../services/LoginService";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { telemetryFactory } from "@/utils/telemetry";
import { logEvent } from "@/utils/googleAnalytics";
import { showToastMessage } from "@/components/Toastify";
import Link from "@mui/material/Link";
// import loginImage from "../../public/loginImage.jpg";
import loginImage from "../../public/all-saas-login.png";
import { useUserIdStore } from "@/store/useUserIdStore";
import { getUserDetailsInfo } from "@/services/UserList";
import { Storage } from "@/utils/app.constant";
import useSubmittedButtonStore from "@/utils/useSharedState";
import { Role } from "@/utils/app.constant";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/VpnKey";

const LoginPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(lang);
  const [language, setLanguage] = useState(selectedLanguage);

  const theme = useTheme<any>();
  const router = useRouter();
  const { setUserId } = useUserIdStore();
  const setAdminInformation = useSubmittedButtonStore(
    (state: any) => state.setAdminInformation
  );

  // Use useMediaQuery to detect screen size
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const passwordRef = useRef<HTMLInputElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const preferredLang = localStorage.getItem("preferredLanguage") || "en";
      setLanguage(preferredLang);
      setLang(preferredLang);

      const token = localStorage.getItem("token");
      if (token) {
        router.push("/tenant");
      }
    }
  }, []);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const trimmedValue = value.trim();
    setUsername(trimmedValue);
    setUsernameError(/\s/.test(trimmedValue));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
    logEvent({
      action: "show-password-icon-clicked",
      category: "Login Page",
      label: "Show Password",
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // const fetchUserDetail = async () => {
  //   let userId;
  //   try {
  //     if (typeof window !== "undefined" && window.localStorage) {
  //       userId = localStorage.getItem(Storage.USER_ID);
  //     }
  //     const fieldValue = true;
  //     if (userId) {
  //       console.log("true");
  //       const response = await getUserDetailsInfo(userId, fieldValue);

  //       const userInfo = response?.userData;
  //       //set user info in zustand store
  //       setAdminInformation(userInfo);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserDetail();
  // }, []);
  const fetchUserDetail = async () => {
    let userId;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        userId = localStorage.getItem(Storage.USER_ID);
      }
      const fieldValue = true;
      if (userId) {
        console.log("true");
        const response = await getUserDetailsInfo(userId, fieldValue);

        const userInfo = response?.userData;
        //set user info in zustand store
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("adminInfo", JSON.stringify(userInfo));
          localStorage.setItem("stateName", userInfo?.customFields[0]?.value);
        }

        if (userInfo.role !== Role.ADMIN && !(userInfo.isSuperAdmin) ) {
          const errorMessage = t("LOGIN_PAGE.ACCESS_DENIED");
          showToastMessage(errorMessage, "error");
          localStorage.removeItem("token");
        } else {
          setAdminInformation(userInfo);
          router.push("/tenant");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    logEvent({
      action: "login-button-clicked",
      category: "Login Page",
      label: "Login Button Clicked",
    });
    if (!usernameError && !passwordError) {
      setLoading(true);
      try {
        const response = await login({ username, password });
        if (response) {
          if (typeof window !== "undefined" && window.localStorage) {
            const token = response?.result?.access_token;
            const refreshToken = response?.result?.refresh_token;
            localStorage.setItem("token", token);
            rememberMe
              ? localStorage.setItem("refreshToken", refreshToken)
              : localStorage.removeItem("refreshToken");

            const userResponse = await getUserId();
            localStorage.setItem("userId", userResponse?.userId);
            // Update Zustand store
            setUserId(userResponse?.userId || "");

            localStorage.setItem("name", userResponse?.name);
            const tenantId = userResponse?.tenantData?.[0]?.tenantId;
            localStorage.setItem("tenantId", tenantId);
          }
        }
        setLoading(false);
        const telemetryInteract = {
          context: { env: "sign-in", cdata: [] },
          edata: {
            id: "login-success",
            type: "CLICK",
            pageid: "sign-in",
            uid: localStorage.getItem("userId") || "Anonymous",
          },
        };
        telemetryFactory.interact(telemetryInteract);
        fetchUserDetail();
      } catch (error: any) {
        setLoading(false);
        const errorMessage = t("LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT");
        showToastMessage(errorMessage, "error");
      }
    }
  };

  const isButtonDisabled =
    !username || !password || usernameError || passwordError;

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value;
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("preferredLanguage", newLocale);
      setLanguage(newLocale);
      ReactGA.event("select-language-login-page", {
        selectedLanguage: newLocale,
      });
      router.push("/login", undefined, { locale: newLocale });
    }
  };

  const handleForgotPasswordClick = () => {
    logEvent({
      action: "forgot-password-link-clicked",
      category: "Login Page",
      label: "Forgot Password Link Clicked",
    });
  };

  return (
    <Grid container sx={{}}>
      {!(isMobile || isMedium) && ( // Render only on desktop view
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: `url(${loginImage.src}) no-repeat center center`,
            backgroundSize: "contain",
            height: "100vh",
          }}
        />
      )}
      <Grid
        item
        xs={12}
        md={6}
        display="flex"
        alignItems="center"
        sx={{
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            margin: "auto",
            padding: 4,
            boxShadow: isMedium || isMobile ? null : 3,
          }}
        >
          <form onSubmit={handleFormSubmit}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
              borderRadius={2}
            >
              {loading && (
                <Loader showBackdrop={true} loadingText={t("COMMON.LOADING")} />
              )}
              <Image src={appLogo} alt="App Logo" height={100} />
            </Box>
            {/* <Typography
              variant="h4"
              gutterBottom
              textAlign="center"
              sx={{ mt: 2 }}
            >
              {t("LOGIN_PAGE.LOGIN")}
            </Typography> */}
            <FormControl fullWidth margin="normal">
              <Select
                className="SelectLanguages"
                value={language}
                onChange={handleChange}
                displayEmpty
                sx={{
                  borderRadius: "0.5rem",
                  color: theme.palette.warning.A200,
                  width: "117px",
                  height: "32px",
                  marginBottom: "0rem",
                  fontSize: "14px",
                }}
              >
                {config.languages.map((lang) => (
                  <MenuItem value={lang.code} key={lang.code}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              id="username"
              InputLabelProps={{ shrink: true }}
              // label={t("LOGIN_PAGE.USERNAME")}
              placeholder={t("LOGIN_PAGE.USERNAME_PLACEHOLDER")}
              value={username}
              onChange={handleUsernameChange}
              error={usernameError}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px", // Adjust the value as needed for more or less rounding
                },
              }}
            />
            {/* <TextField
              fullWidth
              id="username"
              InputLabelProps={{ shrink: true }}
              label={t("LOGIN_PAGE.USERNAME")}
              placeholder={t("LOGIN_PAGE.USERNAME_PLACEHOLDER")}
              value={username}
              onChange={handleUsernameChange}
              error={usernameError}
              margin="normal"
            /> */}

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              id="password"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              // label={t("LOGIN_PAGE.PASSWORD")}
              placeholder={t("LOGIN_PAGE.PASSWORD_PLACEHOLDER")}
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
              margin="normal"
              inputRef={passwordRef}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px", // Adjust the value as needed for more or less rounding
                },
              }}
            />

            <Box
              display="flex"
              alignItems="center"
              marginTop="1.2rem"
              className="remember-me-checkbox"
            >
              {/* <Checkbox
                onChange={(e) => setRememberMe(e.target.checked)}
                checked={rememberMe}
              />
              <Typography
                variant="body2"
                onClick={() => {
                  setRememberMe(!rememberMe);
                  logEvent({
                    action: "remember-me-button-clicked",
                    category: "Login Page",
                    label: `Remember Me ${
                      rememberMe ? "Checked" : "Unchecked"
                    }`,
                  });
                }}
                sx={{
                  cursor: "pointer",
                  marginTop: "15px",
                  color: theme.palette.warning[300],
                }}
              >
                {t("LOGIN_PAGE.REMEMBER_ME")}
              </Typography> */}
            </Box>
            <Box marginTop="2rem" textAlign="center">
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={isButtonDisabled}
                ref={loginButtonRef}
              >
                {t("LOGIN_PAGE.LOGIN")}
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      noLayout: true,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default LoginPage;
