import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Help } from '@mui/icons-material';
import { useRouter } from 'next/router';

const HelpButton: React.FC = () => {
  const router = useRouter();

  const handleHelpClick = () => {
    router.push('/help');
  };

  return (
    <Tooltip title="Help & Documentation">
      <IconButton
        onClick={handleHelpClick}
        sx={{
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Help />
      </IconButton>
    </Tooltip>
  );
};

export default HelpButton; 