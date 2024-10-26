import './Header.css';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';

const Header = ({ scrollToFAQ }) => {
  // State to store the anchor element for the menu
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ padding: { xs: '0 10px', sm: '0 20px' }, minHeight: '64px' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Title and logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1.2rem', sm: '1.8rem' }, fontWeight: 'bold' }}>
              DCA
            </Typography>
            <img src="/umbrella.png" alt="Logo" style={{ height: '40px', marginLeft: '5px' }} />
          </Box>
  
          {/* Centered Navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
            <Button color="inherit" component={Link} to="/home" sx={{ fontSize: '1rem', marginX: '20px' }}>Home</Button>
            <Button color="inherit" onClick={handleMenu} sx={{ fontSize: '1rem', marginX: '20px' }}>Models</Button>
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
            
            <Button
  color="inherit"
  onClick={() => {
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }
  }}
  sx={{ fontSize: '1rem', marginX: '20px' }}
>
  FAQ
</Button>
            <Button color="inherit" component={Link} to="/about" sx={{ fontSize: '1rem', marginX: '20px' }}>About Us</Button>
          </Box>
  
          {/* User Profile Icon */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/user.png" alt="User" style={{ height: '40px', marginLeft: '20px' }} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;