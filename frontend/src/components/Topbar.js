import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar } from '@mui/material';

const Topbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000', boxShadow: 'none', borderBottom: 'none' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Explore Courses
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src="path/to/user.jpg" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
