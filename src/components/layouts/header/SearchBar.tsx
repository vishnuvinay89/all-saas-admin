import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, InputBase, Paper, useMediaQuery } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm"),
  );

  const validateKeyword = (keyword: string) => {
    return /^(\S+)( \S+)*$/.test(keyword.trim()) && !/\s{2,}/.test(keyword);
  };

  useEffect(() => {
    if (keyword.trim().length >= 3 && validateKeyword(keyword)) {
      onSearch(keyword);
    }
  }, [keyword]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
     // Replace multiple spaces with a single space
     const normalizedValue = value.replace(/\s{2,}/g, ' ').trimStart();
     setKeyword(normalizedValue);
  //  setKeyword(value.trimStart());

    if (value === "") {
      onSearch("");
    }
  };

  const handleClear = () => {
    setKeyword("");
    onSearch("");
  };

  return (
    <SearchBox>
      <StyledInputBase
        placeholder={placeholder}
        value={keyword}
        onChange={handleInputChange}
        inputProps={{ "aria-label": "search" }}
      />
      {keyword && (
        <IconButton
          type="button"
          onClick={handleClear}
          aria-label="clear"
        >
          <CloseIcon />
        </IconButton>
      )}
      <IconButton
        type="button"
        onClick={() => onSearch(keyword)}
        disabled={keyword.trim().length < 3}
      >
        <SearchIcon />
      </IconButton>
    </SearchBox>
  );
};

export default SearchBar;
