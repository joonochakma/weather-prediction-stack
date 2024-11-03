import React, { useState } from "react";
import "./Footer.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"; // Importing Material-UI components for dialog functionality

// Function to smoothly scroll to the FAQ section when called
const scrollToFAQ = () => {
  const element = document.getElementById("faq-section");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" }); // Smooth scroll effect
  }
};

function Footer() {
  // State variables to control the opening and closing of the privacy policy and terms & conditions dialogs
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const [openTermsConditions, setOpenTermsConditions] = useState(false);

  // Handlers to open and close the privacy policy dialog
  const handlePrivacyPolicyOpen = () => setOpenPrivacyPolicy(true);
  const handlePrivacyPolicyClose = () => setOpenPrivacyPolicy(false);

  // Handlers to open and close the terms & conditions dialog
  const handleTermsConditionsOpen = () => setOpenTermsConditions(true);
  const handleTermsConditionsClose = () => setOpenTermsConditions(false);

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h3>About Us</h3>
          <p className="text-white">
            At DCA Weather Website, we provide real-time weather updates and
            forecasts to help you stay prepared. With reliable data and
            user-friendly features, we're your trusted source for all things
            weather.
          </p>
        </div>
        <div className="footer-column">
          <h3>Contact Us</h3>
          <ul>
            <li>Address: Swinburne University of Technology</li>
            <li>
              Contact Number: <a href="tel:+61451722891">+61 451722891</a>
            </li>
            <li>
              Email:{" "}
              <a href="mailto:dcaweather@gmail.com">dcaweather@gmail.com</a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Site Map</h3>
          <ul>
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="rainfall">Rainfall</a>
            </li>
            <li>
              <a href="temperature">Temperature</a>
            </li>
            <li>
              <a href="weather">Weather Conditions</a>
            </li>
            <li>
              <a href="heatwave">Heatwave</a>
            </li>
            <li>
              <a href="#faq-section" onClick={scrollToFAQ}>
                FAQ
              </a>
            </li>
            <li>
              <a href="about">About Us</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-middle">
        <ul className="information">
          <p className="text-white">
            Information based on data provided by{" "}
            <a href="http://www.bom.gov.au/climate/dwo/202311/html/IDCJDW3050.202311.shtml">
              BOM (Bureau Of Meteorology)
            </a>{" "}
            &{" "}
            <a href="https://www.kaggle.com/datasets/nadzmiagthomas/australia-weather-data-2000-2024">
              KAGGLE Dataset
            </a>
          </p>
        </ul>
      </div>
      <div className="footer-bottom">
        <div className="footer-left">
          <img src="/umbrella.png" alt="Logo" className="footer-logo" />
        </div>
        <div className="footer-right">
          <p className="text-white">&copy; 2024 DCA | All Rights Reserved </p>
          <a href="#privacy-policy" onClick={handlePrivacyPolicyOpen}>
            Privacy Policy
          </a>
          <a href="#terms-conditions" onClick={handleTermsConditionsOpen}>
            Terms & Conditions
          </a>
        </div>
      </div>
      {/* Dialog for Privacy Policy */}
      <Dialog
        open={openPrivacyPolicy}
        onClose={handlePrivacyPolicyClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="dialog-title">Privacy Policy</DialogTitle>
        <DialogContent className="dialog-content">
          <p>
            <strong>Last Updated: 1/11/2024</strong>
          </p>
          <p>
            Welcome to DCA Weather! We value your privacy and are committed to
            protecting your personal data. This Privacy Policy outlines the
            information we collect, how we use it, and your rights regarding
            your personal information.
          </p>
          <h4>Information We Collect</h4>
          <p>
            We may collect personal information from you when you use our
            services, including:
          </p>
          <ul>
            <li>Name</li>
            <li>Email Address</li>
            <li>Location Data</li>
            <li>Usage Data</li>
          </ul>
          <h4>How We Use Your Information</h4>
          <p>
            Your information may be used in the following ways:
          </p>
          <ul>
            <li>To provide and maintain our services.</li>
            <li>To notify you about changes to our services.</li>
            <li>To allow you to participate in interactive features.</li>
            <li>To provide customer support.</li>
            <li>To gather analysis or valuable information.</li>
            <li>To monitor the usage of our services.</li>
            <li>To detect, prevent and address technical issues.</li>
          </ul>
          <h4>Your Rights</h4>
          <p>
            You have the right to request access to the personal data we hold
            about you, to request corrections to that data, and to request
            deletion of your personal data under certain circumstances.
          </p>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handlePrivacyPolicyClose}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for Terms and Conditions */}
      <Dialog
        open={openTermsConditions}
        onClose={handleTermsConditionsClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle className="dialog-title">Terms and Conditions</DialogTitle>
        <DialogContent className="dialog-content">
          <p>
            <strong>Last Updated: 1/11/2024</strong>
          </p>
          <p>
            Welcome to DCA Weather! By using this website, you agree to comply
            with these Terms and Conditions. Please read them carefully.
          </p>
          <h4>Acceptance of Terms</h4>
          <p>
            By accessing this website, you acknowledge that you have read,
            understood, and agree to be bound by these Terms and Conditions.
          </p>
          <h4>Use of the Website</h4>
          <p>
            You may use this website for lawful purposes only. You agree not
            to use the site in any way that violates any applicable federal,
            state, local, or international law.
          </p>
          <h4>Intellectual Property</h4>
          <p>
            All content, trademarks, and other intellectual property on this
            website are the property of DCA Weather or our licensors. You may
            not reproduce, distribute, or create derivative works from this
            content without our express written consent.
          </p>
          <h4>Limitation of Liability</h4>
          <p>
            In no event shall DCA Weather be liable for any direct, indirect,
            incidental, special, consequential, or punitive damages arising
            from or related to your use of the website.
          </p>
          <h4>Changes to Terms</h4>
          <p>
            We reserve the right to modify these Terms and Conditions at any
            time. Your continued use of the website following any changes
            signifies your acceptance of the new terms.
          </p>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleTermsConditionsClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </footer>
  );
}

export default Footer; // Exporting the Footer component for use in other parts of the application
