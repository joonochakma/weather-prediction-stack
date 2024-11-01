import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem, Typography, Box } from '@mui/material';
import './Footer.css';

function Footer() {
  const [modelsAnchorEl, setModelsAnchorEl] = useState(null);

  const handleModelsMenuOpen = (event) => setModelsAnchorEl(event.currentTarget);
  const handleModelsMenuClose = () => setModelsAnchorEl(null);

  const scrollToFAQ = () => {
    const faqElement = document.getElementById('faq-section'); // Ensure this ID matches your FAQ section's ID
    if (faqElement) {
      faqElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <Box className="footer-top">
        <Box className="footer-column">
          <Typography variant="h6">About Us</Typography>
          <Typography variant="body2" className="text-white">
            At DCA Weather Website, we provide real-time weather updates and forecasts to help you stay prepared.
            With reliable data and user-friendly features, we're your trusted source for all things weather.
          </Typography>
        </Box>

        <Box className="footer-column">
          <Typography variant="h6">Contact Us</Typography>
          <ul>
            <li>Address: Swinburne University of Technology</li>
            <li>Contact Number: +61 451722891</li>
            <li>Email: dcaweather@gmail.com</li>
          </ul>
        </Box>

        <Box className="footer-column">
          <Typography variant="h6">Site Map</Typography>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li>
              <Typography
                variant="subtitle1"
                onClick={handleModelsMenuOpen}
                style={{ cursor: 'pointer', color: 'inherit' }}
              >
                Models
              </Typography>
              <Menu
                anchorEl={modelsAnchorEl}
                open={Boolean(modelsAnchorEl)}
                onClose={handleModelsMenuClose}
                className="models-menu"
              >
                <MenuItem component={Link} to="/rainfall" onClick={handleModelsMenuClose}>Rainfall</MenuItem>
                <MenuItem component={Link} to="/temperature" onClick={handleModelsMenuClose}>Temperature</MenuItem>
                <MenuItem component={Link} to="/weather" onClick={handleModelsMenuClose}>Weather Conditions</MenuItem>
                <MenuItem component={Link} to="/heatwave" onClick={handleModelsMenuClose}>Heatwave</MenuItem>
              </Menu>
            </li>
            <li><span onClick={scrollToFAQ} style={{ cursor: 'pointer', color: 'inherit' }}>FAQ</span></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </Box>
      </Box>

      <Box className="footer-middle">
        <Typography variant="body2" className="text-white">
          Information based on data provided by <a href="http://www.bom.gov.au/climate/dwo/202311/html/IDCJDW3050.202311.shtml">BOM (Bureau Of Meteorology)</a> & <a href="https://www.kaggle.com/datasets/nadzmiagthomas/australia-weather-data-2000-2024">KAGGLE Dataset</a>
        </Typography>
      </Box>

      <Box className="footer-bottom">
        <Box className="footer-left">
          <img src="/umbrella.png" alt="Logo" className="footer-logo" />
        </Box>
        <Box className="footer-center">
          <ul className="social-media-links">
            <li><a href="" target="_blank" rel="noopener noreferrer"><img src="/facebook.png" alt="link to Facebook"></img></a></li>
            <li><a href="" target="_blank" rel="noopener noreferrer"><img src="/x.png" alt="link to X"></img></a></li>
            <li><a href="" target="_blank" rel="noopener noreferrer"><img src="/instagram.png" alt="link to Instagram"></img></a></li>
          </ul>
        </Box>
        <Box className="footer-right">
          <Typography variant="body2" className="text-white">&copy; 2024 DCA | All Rights Reserved</Typography>
          <Link to="#privacy-policy">Privacy Policy</Link>
          <Link to="#terms-conditions">Terms & Conditions</Link>
        </Box>
      </Box>
    </footer>
  );
}

export default Footer;
