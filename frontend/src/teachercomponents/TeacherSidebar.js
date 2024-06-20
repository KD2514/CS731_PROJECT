import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { Home, Book, Create, ExitToApp } from '@mui/icons-material';
import {Link, useLocation} from 'react-router-dom';
import Logo from "../components/Logo";

const drawerWidth = 240;

const TeacherSidebar = () => {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px', justifyContent: 'center' }}>
        <Logo/>
        <Typography variant="h6">DeCourses</Typography>
      </Box>
      <List>
        <ListItem button component={Link} to="/teacher/mycourses" onClick={() => {
          console.log(location.pathname)
          location.pathname === '/teacher/mycourses' && window.location.reload(false)
        }}  sx={{ paddingLeft: '16px' }}>
          <ListItemIcon><Book /></ListItemIcon>
          <ListItemText primary="My Courses" />
        </ListItem>
        <ListItem button component={Link} to="/createcourse" sx={{ paddingLeft: '16px' }}>
          <ListItemIcon><Create /></ListItemIcon>
          <ListItemText primary="Create Course" />
        </ListItem>
        <ListItem button component={Link} to="/" sx={{ paddingLeft: '16px' }}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default TeacherSidebar;
