import "./Header.css";
import React, { useState } from "react"; // Importing React and useState hook
import { Link } from "react-router-dom"; // Importing Link for navigation
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"; // Importing Material-UI components
import MenuIcon from "@mui/icons-material/Menu"; // Importing Menu icon

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null); // State for managing the dropdown menu
  const [drawerOpen, setDrawerOpen] = useState(false); // State for managing the drawer's open state

  // Function to open the menu and set anchor element for dropdown
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null); // Function to close the dropdown menu
  const toggleDrawer = (open) => () => setDrawerOpen(open); // Function to toggle the drawer open/close

  // Function to scroll smoothly to the FAQ section
  const scrollToFAQ = () => {
    const element = document.getElementById("faq-section"); // Get the FAQ section by ID
    if (element) {
      setDrawerOpen(false); // Close the drawer first
      // Delay the scroll to ensure the drawer closes before scrolling
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" }); // Scroll smoothly to the FAQ section
      }, 0);
    }
  };

  // Function to render the drawer menu items
  const renderDrawerMenu = () => (
    <List className="drawer-list">
      <ListItem
        button
        component={Link}
        to="/home"
        onClick={toggleDrawer(false)} // Close drawer when navigating
      >
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button onClick={handleMenu}>
        {" "}
        {/* Opens dropdown for models */}
        <ListItemText primary="Models" />
      </ListItem>
      <Menu
        id="models-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)} // Open menu if anchor element is set
        onClose={handleClose} // Close menu when clicked outside
      >
        {/* Menu items for different models */}
        <MenuItem component={Link} to="/rainfall" onClick={handleClose}>
          Rainfall
        </MenuItem>
        <MenuItem component={Link} to="/temperature" onClick={handleClose}>
          Temperature
        </MenuItem>
        <MenuItem component={Link} to="/weather" onClick={handleClose}>
          Weather Conditions
        </MenuItem>
        <MenuItem component={Link} to="/heatwave" onClick={handleClose}>
          Heatwave
        </MenuItem>
      </Menu>
      <ListItem button onClick={scrollToFAQ}>
        {" "}
        {/* Scroll to FAQ section */}
        <ListItemText primary="FAQ" />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/about"
        onClick={toggleDrawer(false)} // Close drawer when navigating
      >
        <ListItemText primary="About Us" />
      </ListItem>
    </List>
  );

  return (
    <Box className="header-container">
      <AppBar position="static" className="app-bar">
        <Toolbar className="toolbar">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className="menu-icon"
            onClick={toggleDrawer(true)} // Open drawer on click
          >
            <MenuIcon /> {/* Icon for menu */}
          </IconButton>

          <Box className="logo-container">
            <Link to="/home" className="logo-link">
              <Typography variant="h6" component="div" className="title">
                DCA {/* Site Title */}
              </Typography>
              <img src="/umbrella.png" alt="Logo" className="logo-image" />{" "}
              {/* Logo image */}
            </Link>
          </Box>

          <Box className="nav-buttons">
            {" "}
            {/* Navigation buttons */}
            <Button
              color="inherit"
              component={Link}
              to="/home"
              className="nav-button"
            >
              Home
            </Button>
            <Button color="inherit" onClick={handleMenu} className="nav-button">
              Models
            </Button>
            <Menu
              id="models-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={Link} to="/rainfall" onClick={handleClose}>
                Rainfall
              </MenuItem>
              <MenuItem
                component={Link}
                to="/temperature"
                onClick={handleClose}
              >
                Temperature
              </MenuItem>
              <MenuItem component={Link} to="/weather" onClick={handleClose}>
                Weather Conditions
              </MenuItem>
              <MenuItem component={Link} to="/heatwave" onClick={handleClose}>
                Heatwave
              </MenuItem>
            </Menu>
            <Button
              color="inherit"
              onClick={scrollToFAQ}
              className="nav-button"
            >
              FAQ
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/about"
              className="nav-button"
            >
              About Us
            </Button>
          </Box>

          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {renderDrawerMenu()} {/* Render drawer menu items */}
          </Drawer>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header; // Export the Header component
