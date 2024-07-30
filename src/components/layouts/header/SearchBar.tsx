import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputBase, Paper, useMediaQuery } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder: string;
}

const SearchBox = styled(Paper)(({ theme }) => ({
  padding: "2px 4px",
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: 400,
  borderRadius: "8px",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
}));

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [keyword, setKeyword] = useState("");
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      onSearch("");
    }
    setKeyword(event.target.value);
  };

  const handleSearch = () => {
    onSearch(keyword);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <SearchBox>
      <StyledInputBase
        placeholder={isSmallScreen ? placeholder : placeholder}
        value={keyword}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        inputProps={{ "aria-label": "search" }}
      />
      <IconButton type="button" onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
    </SearchBox>
  );
};

export default SearchBar;
