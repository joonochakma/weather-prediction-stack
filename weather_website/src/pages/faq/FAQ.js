import React from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./faq.css";

const FAQ = () => {
  // Array of FAQ objects
  const faqs = [
    {
      question: "What is this website about?",
      answer:
        "This website provides weather-related information including temperature, weather condition, rainfall prediction, heatwave and more.",
    },
    {
      question:
        "How can I find current weather info of a specific city in Australia?",
      answer:
        "You can find the weather information of a specific city by searching the city name from the search bar at Home page.",
    },
    {
      question: "Where can I find each prediction tool?",
      answer:
        "You can access prediction tools under the 'MODELS' dropdown menu section of the website header.",
    },
    {
      question: "What is the purpose of these prediction tools?",
      answer:
        "Our prediction tool uses advanced machine learning models to provide accurate forecasts for weather patterns, including temperature, rainfall, and other conditions based on your inputs.",
    },
    {
      question: "How accurate are the predictions?",
      answer:
        "Our model has been trained on extensive historical weather data and fine-tuned for accuracy. However, temperarure and heatwave predictions are inherently uncertain, and we recommend using our tool as a guide rather than an absolute.",
    },
    {
      question: "What data do I need to input for the prediction?",
      answer:
        "You need to enter information such as maximum and minimum temperatures, rainfall, and humidity levels at specific times (like 9 AM and 3 PM) for the model to provide an accurate forecast.",
    },
    {
      question: "Can I still get a prediction if I don’t have all the data?",
      answer:
        "Yes, for weather condition model if some fields are left blank, the model will use average values for those fields. However, for the most accurate results, we recommend filling in as many fields as possible.",
    },
    {
      question: "My prediction shows an “Error.” What should I do?",
      answer:
        "An “Error” message may indicate a technical issue. Refresh the page and try again. If the issue continues, please contact us for technical support.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Yes, we prioritize your data security. Any data you provide is used solely for prediction purposes and is not stored permanently.",
    },
    {
      question: "Are you planning to add more features?",
      answer:
        "Yes! We’re constantly working to improve our tool. Upcoming features include more customizable prediction settings and integrations with real-time weather APIs.",
    },
    {
      question: "Can I request a feature or improvement?",
      answer:
        "Absolutely. We value your feedback and encourage you to reach out with suggestions for features that could enhance your experience.",
    },
    {
      question: "What is forecasting?",
      answer:
        "A calculation or estimate of future events, especially upcoming weather.",
    },
    {
      question: "What is rainfall prediction?",
      answer:
        "Rainfall prediction estimates whether it will rain and, in some cases, how much precipitation will occur. It’s often represented as a probability (chance of rain) and measured in millimeters (mm) of rainfall.",
    },
    {
      question: "What is temperature prediction?",
      answer:
        "Temperature prediction forecasts the average temperature for a future date. It is usually measured in degrees Celsius (°C) or Fahrenheit (°F) and is often broken down into daily highs, lows, and average temperatures.",
    },
    {
      question: "What is weather condition classification?",
      answer:
        "Weather condition classification categorizes the general state of the weather into types, such as sunny, cloudy, rainy, windy, or stormy. This classification uses a combination of factors like cloud cover, wind speed, temperature, and humidity to label the overall weather condition.",
    },
    {
      question: "What is heatwave prediction?",
      answer:
        "A heatwave prediction identifies prolonged periods of excessively hot weather. Heatwaves are defined differently across regions but generally consist of several consecutive days of high temperatures above a specific threshold.",
    },
  ];

  return (
    <Box id="faq-section" className="faq-container">
      <h2 className="faq-title">FAQ</h2>
      <p className="faq-description">
        Here are some frequently asked questions:
      </p>
      {faqs.map(
        (
          faq,
          index // Loop through the FAQ array
        ) => (
          <Accordion key={index} className="accordion">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#1976d2" }} />}
            >
              <div className="faq-question">{faq.question}</div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="faq-answer">{faq.answer}</div>
            </AccordionDetails>
          </Accordion>
        )
      )}
    </Box>
  );
};

export default FAQ;
