// import React, { useState } from "react";
// import FeatherIcon from "feather-icons-react";
// import { IconButton, Input, Box, Drawer } from "@mui/material";

// const SearchDD = () => {
//   // drawer top
//   const [showDrawer2, setShowDrawer2] = useState(false);

//   const handleDrawerClose2 = () => {
//     setShowDrawer2(false);
//   };
//   return (
//     <>
//       <IconButton
//         aria-label="show 4 new mails"
//         color="inherit"
//         aria-controls="search-menu"
//         aria-haspopup="true"
//         onClick={() => setShowDrawer2(true)}
//         size="large"
//       >
//         <FeatherIcon icon="search" width="20" height="20" />
//       </IconButton>
//       <Drawer
//         anchor="top"
//         open={showDrawer2}
//         onClose={() => setShowDrawer2(false)}
//         sx={{
//           "& .MuiDrawer-paper": {
//             padding: "15px 30px",
//           },
//         }}
//       >
//         <Box display="flex" alignItems="center">
//           <Input placeholder="Search here" aria-label="description" fullWidth />
//           <Box
//             sx={{
//               ml: "auto",
//             }}
//           >
//             <IconButton
//               color="inherit"
//               sx={{
//                 color: (theme) => theme.palette.grey.A200,
//               }}
//               onClick={handleDrawerClose2}
//             >
//               <FeatherIcon icon="x-circle" />
//             </IconButton>
//           </Box>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default SearchDD;



import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';


export default function SearchBar({backgroundColor,placeholder}: any ) {
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
   backgroundColor: backgroundColor,
    '&:hover': {
    //  backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
     // marginLeft: theme.spacing(3),
      width: '50%',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    color: 'black',
      padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'black',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '100ch',
      },
    },
  }));
  
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon  />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search' }}
      />
    </Search>
  );
}
