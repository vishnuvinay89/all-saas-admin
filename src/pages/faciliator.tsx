import * as React from "react";
import { useState, useEffect } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import SearchBar from "@/components/layouts/header/SearchBar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { userList } from "../services/userList";
import { useTranslation } from "next-i18next";

type UserDetails = {
  userId: any
  username: any
  name: any
  role: any
  mobile: any
};

const AllStates = ["maharashtra", "Gujarat"];
const AllDistrict = ["Kolhapur", "Pune"];
const AllBlocks = ["Kothrud", "Warje"];
const Sort = ["Names", "A-Z" , "Z-A" ,"Centers"];


const Facilitators: React.FC = () => {
  const [selectedState, setSelectedState] = useState("All states");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedBlock, setSelectedBlock] = useState("All Blocks");
  const [selectedSort, setSelectedSort] = useState("Sort");

  const { t } = useTranslation();
  const [data, setData] = useState<UserDetails[]>([]);

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
  const handleSortChange = (event: SelectChangeEvent) => {
    setSelectedSort(event.target.value as string);
  };
console.log(data[0])
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const limit = 0;
        const page = 0;
        const sort = ["createdAt", "asc"];
        const filters = { role: "Teacher" };
        const resp = await userList({ limit, page, filters, sort });
        const result=resp?.getUserDetails;
        setData(result[0]);
      } catch (error) {
        console.error('Error fetching user list:', error);
      }
    };
    fetchUserList();
  }, []);

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
      <Box
       sx={{
        display: "flex",
        flexDirection: "row",
        gap: isMobile ? "0.1px" : "16px",
      }}
      >
        <Box>
        <SearchBar width="100%" placeholder={t("NAVBAR.SEARCHBAR_PLACEHOLDER")} backgroundColor="#EEEEEE" />

        </Box>
      <FormControl sx={{ m: "1rem 1 1rem" }}>
          <Select
            value={selectedSort}
            onChange={handleSortChange}
            displayEmpty
            style={{
              borderRadius: "0.5rem",
              width: "117px",
              height: "32px",
              marginBottom: "0rem",
              fontSize: "14px",
            }}
          >
            <MenuItem value="Sort">Sort</MenuItem>
            {Sort.map((state, index) => (
              <MenuItem value={state} key={index}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
     
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "40px",
          padding: "0px 16px",
          alignItems: "center",
          width: "100px",
          borderRadius: "20px",
          border: "1px solid var(--M3-ref-neutral-neutral10, #1E1B16)",
          marginTop:isMobile? "10px" : null
        }}
      >
        <Typography>{t("COMMON.ADD_NEW")}</Typography>
        <AddIcon />
      </Box>
      <List sx={{ bgcolor: 'background.paper' }}>
        {data.map((user, index,) => (
          <ListItem key={index}>
            <ListItemAvatar>
              {/* You can uncomment and use Avatar if needed */}
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
                  {/* {user.role} */}
                </Typography>
              }
            />
            <MoreVertIcon />
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
