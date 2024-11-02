import React from 'react'; 
import { Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './faq.css'; 

const FAQ = () => {
  // Array of FAQ objects
  const faqs = [
    {
      question: "What is this website about?",
      answer: "This website provides weather-related information including temperature, weather condition, rainfall prediction, and more."
    },
    {
      question: "How can I find current weather info of a specific city in Australia?",
      answer: "You can find the weather information of a specific city by selecting the city from the dropdown menu on the home page."
    },
    {
      question: "Where can I find weather prediction?",
      answer: "Weather prediction data is available under the 'MODELS' dropdown menu section of the website header."
    },
    {
      question: "What is rainfall prediction?",
      answer: "Rainfall prediction is the estimation of the amount of rainfall that is expected to occur in a specific area over a certain period of time."
    },
    {
      question: "What is a heatwave?",
      answer: "A heatwave is a prolonged period of excessively hot weather, which may be accompanied by high humidity."
    },
    {
      question: "What is forecasting?",
      answer: "A calculation or estimate of future events, especially upcoming weather."
    }
  ];

  return (
    <Box id="faq-section" className="faq-container">
      <h2 className="faq-title">FAQ</h2>
      <p className="faq-description">Here are some frequently asked questions:</p>
      {faqs.map((faq, index) => ( // Loop through the FAQ array
        <Accordion key={index} className="accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#1976d2' }} />}>
            <div className="faq-question">
              {faq.question}
            </div> 
          </AccordionSummary>
          <AccordionDetails>
            <div className="faq-answer">
              {faq.answer}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;