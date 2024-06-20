import React from 'react';
import { Box } from '@mui/material';

const Logo = () => {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        backgroundColor: 'white', // Placeholder for logo, replace with your logo image
        borderRadius: '0%' // Change to box shape
      }}
    >
        <img style={{
            width: 40,
            height: 40
        }} src="/logo.png" alt="LOGO"/>
    </Box>
  );
};

export default Logo;
