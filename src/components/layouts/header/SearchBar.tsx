import React, { useState } from 'react';
import { Box, InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder: string;
}

const SearchBox = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: 400,
  borderRadius: '8px',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
}));

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [keyword, setKeyword] = useState('');

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
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SearchBox>
      <StyledInputBase
        placeholder={placeholder}
        value={keyword}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton type="button" onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
    </SearchBox>
  );
};

export default SearchBar;
