import './Header.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material'; // import the necessary MUI components


const Header = () => {
  // State to manage the anchor element for the menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Function to handle opening the menu
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle closing the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}> {/* Box component as container for the header */}
      <AppBar position="static"> {/* AppBar component for the header */}
        <Toolbar>
          {/* Typography component for the title and logo */}
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, fontSize: '1.8rem', fontWeight: 'bold' }}>
             DCA
            <img src="/umbrella.png" alt="Logo" style={{ height: '40px', marginLeft: '10px' }} />
          </Typography>
          {/* Button component for the Home link */}
          <Button color="inherit" component={Link} to="/home" sx={{fontSize:'1rem', mr:'5px'}}>Home</Button>
          {/* Button component for the Models dropdown menu */}
          <Button color="inherit" onClick={handleMenu} sx={{fontSize:'1rem', mr:'5px'}}>
            Models
          </Button>
          {/* Dropdown menu for model options */}
          <Menu
            id="models-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/rainfall" onClick={handleClose}>Rainfall</MenuItem>
            <MenuItem component={Link} to="/temperature" onClick={handleClose}>Temperature</MenuItem>
            <MenuItem component={Link} to="/Weather" onClick={handleClose}>Weather Conditions</MenuItem>
            <MenuItem component={Link} to="/heatwave" onClick={handleClose}>Heatwave</MenuItem>
          </Menu>
          {/* Button component for the Settings link */}
          <Button color="inherit" component={Link} to="/settings" sx={{fontSize:'1rem', mr:'10px'}}>Settings</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;