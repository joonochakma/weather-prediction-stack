import React, { useState } from "react";
import "./Footer.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const scrollToFAQ = () => {
  const element = document.getElementById("faq-section");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

function Footer() {
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const [openTermsConditions, setOpenTermsConditions] = useState(false);

  const handlePrivacyPolicyOpen = () => setOpenPrivacyPolicy(true);
  const handlePrivacyPolicyClose = () => setOpenPrivacyPolicy(false);

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

      <Dialog
        open={openPrivacyPolicy}
        onClose={handlePrivacyPolicyClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle style={{ color: "#1976d2", fontWeight: "bold" }}>
          Privacy Policy
        </DialogTitle>
        <DialogContent>
          <p>
            <strong>Last Updated: 1/11/2024</strong>
          </p>
          <p>
            Welcome to DCA Weather! We value your privacy and are committed to
            protecting your personal data. This Privacy Policy outlines the
            information we collect, how we use it, and your rights regarding
            your personal information.
          </p>
          <p>
            <strong>1. Information We Collect</strong>
          </p>
          <ul>
            <li>
              <strong>Personal Information:</strong> When you use our website,
              we may collect personal information, such as your name, email
              address, and location, to provide customized weather updates and
              improve our services.
            </li>
            <li>
              <strong>Usage Data:</strong> We automatically collect certain data
              about your interaction with the site, including IP address,
              browser type, and browsing actions.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies to improve user
              experience, personalize content, and analyze traffic.
            </li>
          </ul>
          <p>
            <strong>2. How We Use Your Information</strong>
          </p>
          <ul>
            <li>
              <strong>Provide Services:</strong> We use your data to deliver
              real-time weather updates and forecasts based on your location.
            </li>
            <li>
              <strong>Improve Services:</strong> We analyze usage data to
              enhance website functionality and user experience.
            </li>
            <li>
              <strong>Communication:</strong> We may use your email to send
              notifications or updates if you’ve opted in.
            </li>
          </ul>
          <p>
            <strong>3. Data Sharing and Disclosure</strong>
          </p>
          <p>
            We do not sell or share your personal information with third
            parties, except as necessary to provide services, comply with the
            law, or protect our rights.
          </p>
          <p>
            <strong>4. Data Retention</strong>
          </p>
          <p>
            We retain your information only for as long as needed to fulfill the
            purposes outlined in this policy, unless a longer retention period
            is required by law.
          </p>
          <p>
            <strong>5. Security</strong>
          </p>
          <p>
            We use reasonable measures to protect your information from
            unauthorized access, disclosure, or destruction. However, no
            internet transmission is 100% secure, and we cannot guarantee
            absolute security.
          </p>
          <p>
            <strong>6. Your Rights</strong>
          </p>
          <p>
            You may have the right to access, correct, delete, or restrict the
            use of your personal data. Please contact us if you wish to exercise
            any of these rights.
          </p>
          <p>
            <strong>7. Changes to the Privacy Policy</strong>
          </p>
          <p>
            We may update this Privacy Policy periodically. We will notify you
            of any changes by posting the new policy on this page with a revised
            "Last Updated" date.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrivacyPolicyClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openTermsConditions}
        onClose={handleTermsConditionsClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle style={{ color: "#1976d2", fontWeight: "bold" }}>
          Terms and Conditions
        </DialogTitle>
        <DialogContent>
          <p>
            <strong>Last Updated: 1/11/2024</strong>
          </p>
          <p>
            Welcome to DCA Weather! By using this website, you agree to comply
            with these Terms and Conditions. Please read them carefully.
          </p>
          <p>
            <strong>1. Use of the Website</strong>
          </p>
          <ul>
            <li>
              You may use DCA Weather solely for personal, non-commercial
              purposes.
            </li>
            <li>
              You agree not to misuse the website, including by attempting
              unauthorized access, distributing malicious software, or engaging
              in any illegal activities.
            </li>
          </ul>
          <p>
            <strong>2. Weather Information</strong>
          </p>
          <ul>
            <li>
              <strong>Accuracy:</strong> While we strive to provide accurate
              weather updates and forecasts, weather conditions are subject to
              change, and we cannot guarantee accuracy.
            </li>
            <li>
              <strong>Disclaimer:</strong> Weather forecasts and alerts provided
              by DCA Weather are for informational purposes only and should not
              replace official sources or emergency services.
            </li>
          </ul>
          <p>
            <strong>3. Intellectual Property</strong>
          </p>
          <p>
            All content, logos, and graphics on DCA Weather are protected by
            intellectual property laws. You may not reproduce, distribute, or
            create derivative works from our content without written permission.
          </p>
          <p>
            <strong>4. Limitation of Liability</strong>
          </p>
          <p>
            DCA Weather and its affiliates are not liable for any direct,
            indirect, incidental, or consequential damages arising from the use
            or inability to use the website, including errors, inaccuracies, or
            delays in data.
          </p>
          <p>
            <strong>5. Third-Party Links</strong>
          </p>
          <p>
            Our website may contain links to third-party sites. We are not
            responsible for the content, privacy practices, or terms of those
            third-party sites.
          </p>
          <p>
            <strong>6. Changes to the Terms and Conditions</strong>
          </p>
          <p>
            We may modify these Terms and Conditions at any time. We will notify
            you of changes by posting the updated Terms on this page with the
            revised "Last Updated" date.
          </p>
          <p>
            <strong>7. Governing Law</strong>
          </p>
          <p>
            These Terms and Conditions are governed by the laws of Australia,
            without regard to its conflict of law principles.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTermsConditionsClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </footer>
  );
}

export default Footer;
