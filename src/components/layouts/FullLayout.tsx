import React, { useState } from "react";
import {
  useMediaQuery,
  Container,
  Box,
  ThemeProvider,
  createTheme,
  Theme,
  styled,
} from "@mui/material";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import Footer from "./footer/Footer";
import * as theme from '../theme/theme';
import Dashboard from "@/pages/dashboard";
import Facilitators from "@/pages/Faciliator";
const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  overflow: "hidden",
  width: "100%",
}));

const PageWrapper = styled("div")(({ theme }: { theme: Theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("lg")]: {
    paddingTop: "64px",
  },
  [theme.breakpoints.down("lg")]: {
    paddingTop: "64px",
  },
}));

type RouteKey = '/' | '/manage-users' | '/course-planner' | '/cohorts';

const componentMapping: Record<RouteKey, React.ComponentType> = {
  "/": Dashboard,
  "/manage-users": Facilitators,
  "/course-planner": Dashboard,
  "/cohorts": Dashboard,
};

interface FullLayoutProps {
  children?: React.ReactNode;
}

const FullLayout: React.FC<FullLayoutProps> = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<RouteKey>("/");

  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));

  const ActiveComponent = componentMapping[activeComponent];

  return (
    <ThemeProvider theme={theme}>
      <MainWrapper>
        <Header
          sx={{
            paddingLeft: isSidebarOpen && lgUp ? "265px" : "",
            backgroundColor: "black",
          }}
          toggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
          onMenuItemClick={(href: RouteKey) => setActiveComponent(href)}
        />
        <PageWrapper>
          <Container
            maxWidth={false}
            sx={{
              paddingTop: "20px",
              paddingLeft: isSidebarOpen && lgUp ? "280px!important" : "",
            }}
          >
            <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
              <ActiveComponent />
            </Box>
            <Footer />
          </Container>
        </PageWrapper>
      </MainWrapper>
    </ThemeProvider>
  );
};

export default FullLayout;
