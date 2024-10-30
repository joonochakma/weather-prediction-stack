import './Header.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const scrollToFAQ = () => {
    const element = document.getElementById('faq-section'); // Ensure this matches your FAQ section ID
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      toggleDrawer(false)(); // Close the drawer after scrolling
    }
  };
  
  const renderDrawerMenu = () => (
    <List className="drawer-list">
      <ListItem button component={Link} to="/home" onClick={toggleDrawer(false)}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button onClick={handleMenu}>
        <ListItemText primary="Models" />
      </ListItem>
      <Menu
        id="models-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={Link} to="/rainfall" onClick={handleClose}>Rainfall</MenuItem>
        <MenuItem component={Link} to="/temperature" onClick={handleClose}>Temperature</MenuItem>
        <MenuItem component={Link} to="/weather" onClick={handleClose}>Weather Conditions</MenuItem>
        <MenuItem component={Link} to="/heatwave" onClick={handleClose}>Heatwave</MenuItem>
      </Menu>
      <ListItem button onClick={scrollToFAQ}>
        <ListItemText primary="FAQ" />
      </ListItem>
      <ListItem button component={Link} to="/about" onClick={toggleDrawer(false)}>
        <ListItemText primary="About Us" />
      </ListItem>
    </List>
  );

  return (
    <Box className="header-container">
      <AppBar position="static" className="app-bar">
        <Toolbar className="toolbar">
          <IconButton edge="start" color="inherit" aria-label="menu" className="menu-icon" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>

          <Box className="logo-container">
            <Link to="/home" className="logo-link">
              <Typography variant="h6" component="div" className="title">DCA</Typography>
              <img src="/umbrella.png" alt="Logo" className="logo-image" />
            </Link>
          </Box>

          <Box className="nav-buttons">
            <Button color="inherit" component={Link} to="/home" className="nav-button">Home</Button>
            <Button color="inherit" onClick={handleMenu} className="nav-button">Models</Button>
            <Menu
              id="models-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={Link} to="/rainfall" onClick={handleClose}>Rainfall</MenuItem>
              <MenuItem component={Link} to="/temperature" onClick={handleClose}>Temperature</MenuItem>
              <MenuItem component={Link} to="/weather" onClick={handleClose}>Weather Conditions</MenuItem>
              <MenuItem component={Link} to="/heatwave" onClick={handleClose}>Heatwave</MenuItem>
            </Menu>
            <Button color="inherit" onClick={scrollToFAQ} className="nav-button">FAQ</Button>
            <Button color="inherit" component={Link} to="/about" className="nav-button">About Us</Button>
          </Box>

          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {renderDrawerMenu()}
          </Drawer>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
