import React from 'react';
import './Footer.css';

const scrollToFAQ = () => {
  const element = document.getElementById('faq-section');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

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
            <li>Address: Swinburne University of Technology</li>
            <li>Contact Number: <a href="tel:+61451722891">+61 451722891</a></li>
            <li>Email: <a href="mailto:dcaweather@gmail.com">dcaweather@gmail.com</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Site Map</h3>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="rainfall">Rainfall</a></li>
            <li><a href="temperature">Temperature</a></li>
            <li><a href="weather">Weather Conditions</a></li>
            <li><a href="heatwave">Heatwave</a></li>
            <li><a href="#faq-section" onClick={scrollToFAQ}>FAQ</a></li>
            <li><a href="about">About Us</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-middle">
        <ul className="information">
          <p className='text-white'>Information based on data provided by <a href="http://www.bom.gov.au/climate/dwo/202311/html/IDCJDW3050.202311.shtml">BOM (Bureau Of Meteorology)</a> & <a href="https://www.kaggle.com/datasets/nadzmiagthomas/australia-weather-data-2000-2024">KAGGLE Dataset</a></p>
        </ul>
      </div>

      <div className="footer-bottom">
        <div className="footer-left">
          <img src="/umbrella.png" alt="Logo" className="footer-logo" />
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
