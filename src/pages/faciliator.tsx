import * as React from "react";
import { useState } from "react";
import {
  MenuItem,
  Typography,
  Box,
  FormControl,
  useMediaQuery,
} from "@mui/material";
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "@/components/layouts/header/SearchBar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useTranslation } from "next-i18next";

interface Facilitator {
  name: string;
  location: string;
}

const AllStates = ["maharashtra", "Gujarat"];
const AllDistrict = ["Kolhapur", "Pune"];
const AllBlocks = ["Kothrud", "Warje"];
const users = [
  {
    name: 'Aditi Patel',
    location: 'Bhiwapur, Jabarbodi, Bhiwapur, Jabarbodi'
  },
  {
    name: 'Amit Gupta',
    location: 'Bhiwapur, Jabarbodi, Bhiwapur, Jabarbodi'
  },
  {
    name: 'Anand Joshi',
    location: 'Bhiwapur, Jabarbodi, Bhiwapur, Jabarbodi'
  },
  {
    name: 'Anil Mehta',
    location: 'Bhiwapur, Jabarbodi, Bhiwapur, Jabarbodi'
  },
  {
    name: 'Ananya Shergil',
    location: 'Bhiwapur, Jabarbodi, Bhiwapur, Jabarbodi'
  },
  {
    name: 'Arjun Rao',
    location: 'Bhiwapur, Jabarbodi, Bhiwapur, Jabarbodi'
  },
  {
    name: 'Asiya Jain',
    location: 'Bhiwapur, Jabarbodi, Bhiwapur, Jabarbodi'
  }
];
const Facilitators: React.FC = () => {
  const [selectedState, setSelectedState] = useState("All states");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedBlock, setSelectedBlock] = useState("All Blocks");
  const { t } = useTranslation();

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleStateChange = (event: SelectChangeEvent) => {
    setSelectedState(event.target.value as string);
  };

  const handleDistrictChange = (event: SelectChangeEvent) => {
    setSelectedDistrict(event.target.value as string);
  };

  const handleBlockChange = (event: SelectChangeEvent) => {
    setSelectedBlock(event.target.value as string);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "0.1px" : "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "0.1px" : "16px",
        }}
      >
        <FormControl sx={{ m: "1rem 0 1rem" }}>
          <Select
            value={selectedState}
            onChange={handleStateChange}
            displayEmpty
            style={{
              borderRadius: "0.5rem",
              width: "117px",
              height: "32px",
              marginBottom: "0rem",
              fontSize: "14px",
            }}
          >
            <MenuItem value="All states">
            {t("FACILITATORS.ALL_STATES")}
            </MenuItem>
            {AllStates.map((state, index) => (
              <MenuItem value={state} key={index}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: "1rem 0 1rem" }}>
          <Select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            displayEmpty
            style={{
              borderRadius: "0.5rem",
              width: "117px",
              height: "32px",
              marginBottom: "0rem",
              fontSize: "14px",
            }}
          >
            <MenuItem value="All Districts">
            {t("FACILITATORS.ALL_DISTRICTS")}
            </MenuItem>
            {AllDistrict.map((state, index) => (
              <MenuItem value={state} key={index}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: "1rem 0 1rem" }}>
          <Select
            value={selectedBlock}
            onChange={handleBlockChange}
            displayEmpty
            style={{
              borderRadius: "0.5rem",
              width: "117px",
              height: "32px",
              marginBottom: "0rem",
              fontSize: "14px",
            }}
          >
            <MenuItem value="All Blocks">All Blocks</MenuItem>
            {AllBlocks.map((state, index) => (
              <MenuItem value={state} key={index}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Typography>
      {t("SIDEBAR.FACILITATORS")}

      </Typography>
      <SearchBar placeholder={ t("NAVBAR.SEARCHBAR_PLACEHOLDER")} backgroundColor="#EEEEEE" />

      <Box
        sx={{
          display: "flex",
          // flexDirection: isMobile ? "column" : "row",
          // gap:"px",
          justifyContent: "center",
          height: "40px",
          padding: "0px 16px",
          alignItems: "center",
          width: "100px",
          borderRadius: "20px",
          border: "1px solid var(--M3-ref-neutral-neutral10, #1E1B16)",
        }}
      >
        <Typography>{t("COMMON.ADD_NEW")}</Typography>
        <AddIcon />
      
      </Box>
      <List sx={{  bgcolor: 'background.paper' }}>
      {users.map((user) => (
        <ListItem key={user.name}>
          <ListItemAvatar>
            <Avatar alt={user.name} src={`https://ui-avatars.com/api/?name=${user.name}`} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1">
                {user.name}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="text.secondary">
                {user.location}
              </Typography>
            }
          />
          {/* <Box sx={{ ml: 'auto' }}>
            <Typography variant="body2" color="text.secondary">
              ...
            </Typography>
          </Box> */}
          <MoreVertIcon/>
        </ListItem>
      ))}
    </List>
    </Box>
  );
};
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
export default Facilitators;
