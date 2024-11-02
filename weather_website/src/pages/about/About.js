import React from "react";
import { Container, Typography, Card, CardContent } from "@mui/material";
import "./About.css"; // Importing the CSS file

function About() {
  return (
    <Container
      maxWidth="lg"
      className="about-container" // Using a CSS class for styling
    >
      {/* Website Overview */}
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        About Us
      </Typography>
      <Typography
        variant="h3"
        component="h3"
        align="center"
        className="overview-text"
      >
        Website Overview
      </Typography>
      <Typography variant="body1" align="left" className="overview-text">
        At DCA Weather, we provide real-time weather updates and forecasts to
        help you stay prepared for any conditions. Our platform is designed with
        user experience in mind, featuring a clean and intuitive interface that
        allows users to easily access the latest weather information. Leveraging
        cutting-edge technology, we offer reliable data powered by advanced AI
        models, including:
      </Typography>
      <ul className="overview-list">
        <li>
          <strong>Temperature Forecasts:</strong> Get accurate predictions for
          current and future temperatures in your area, helping you plan your
          day effectively.
        </li>
        <li>
          <strong>Rainfall Predictions:</strong> Stay informed with precise
          forecasts on rainfall patterns, ensuring you're always prepared for
          wet weather.
        </li>
        <li>
          <strong>Heatwave Alerts:</strong> Receive timely notifications about
          potential heatwaves, allowing you to take necessary precautions for
          your health and safety.
        </li>
        <li>
          <strong>Weather Conditions Overview:</strong> Access a comprehensive
          overview of current weather conditions, including wind speed,
          humidity, and visibility.
        </li>
      </ul>
      <Typography variant="body1" align="left" className="overview-text">
        Built using React for a responsive front end and FastAPI for a robust
        back end, DCA Weather ensures fast and efficient data retrieval. Our
        platform is committed to delivering the most accurate and up-to-date
        weather information, making us your trusted source for all things
        weather. Whether you’re planning a trip, heading out for the day, or
        just curious about the weather, DCA Weather has you covered.
      </Typography>

      {/* Team Section */}
      <Typography
        variant="h3"
        component="h3"
        align="center"
        className="team-description"
      >
        Our Team
      </Typography>
      <Typography variant="body1" align="center" className="team-description">
        We are a dedicated team of three members working on this project, each
        bringing unique skills and perspectives:
      </Typography>

      {/* Team Members */}
      <div className="team-container">
        <Card variant="outlined" className="team-card">
          <CardContent>
            <Typography variant="h6">Joono Chakma</Typography>
            <Typography variant="body2">ID: 104582560</Typography>
            <Typography variant="body2">
              Joono handles the header, body, backend, API, and model
              integration, ensuring smooth functionality throughout the website.
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" className="team-card">
          <CardContent>
            <Typography variant="h6">Dhruv Patel</Typography>
            <Typography variant="body2">ID: 105223284</Typography>
            <Typography variant="body2">
              Dhruv is responsible for the frontend, footer, and descriptions
              for temperature and rainfall models. He also created the menu icon
              in the header, focusing on responsiveness, and contributed to the
              report and video.
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" className="team-card">
          <CardContent>
            <Typography variant="h6">Nirachorn Boonnoul</Typography>
            <Typography variant="body2">ID: 104349778</Typography>
            <Typography variant="body2">
              Nirachorn focuses on the FAQ, report, frontend, and descriptions
              for heatwave and weather conditions, enhancing user experience and
              information accessibility.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default About;
