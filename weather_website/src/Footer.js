import React from 'react';
import './Footer.css'; // Assuming you have a CSS file for styling

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h3>About Us</h3>
          <p className='text-white'>At DCA Weather Website, we provide real-time weather updates and forecasts to 
            help you stay prepared. With reliable data and user-friendly features, we're your 
            trusted source for all things weather.</p>
        </div>
        <div className="footer-column">
          <h3>Contact Us</h3>
          <ul>
            <li>Address: [Your Address]</li>
            <li>Tel: [Your Phone Number]</li>
            <li>Email: [Your Email Address]</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Site Map</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#models">Models</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-middle">
        <ul className="information">
          <p className='text-white'>Information based from <a href="http://www.bom.gov.au/climate/dwo/202311/html/IDCJDW3050.202311.shtml">BOM (Bureau Of Meteorology)</a> & <a href="https://www.kaggle.com/datasets/nadzmiagthomas/australia-weather-data-2000-2024">KAGGLE Dataset</a></p>
        </ul>
      </div>

      <div className="footer-bottom">
        <div className="footer-left">
          <img src="/umbrella.png" alt="Logo" className="footer-logo" />
        </div>
        <div className="footer-center">
          <ul className="social-media-links">
            <li><a href="" target="_blank" rel="noopener noreferrer"><img src="/facebook.png"></img></a></li>
            <li><a href="" target="_blank" rel="noopener noreferrer"><img src="/x.png"></img></a></li>
            <li><a href="" target="_blank" rel="noopener noreferrer"><img src="/instagram.png"></img></a></li>
          </ul>
        </div>
        <div className="footer-right">
          <p className='text-white'>&copy; 2024 DCA | All Rights Reserved </p>
          <a href="#privacy-policy">Privacy Policy</a>
          <a href="#terms-conditions">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
