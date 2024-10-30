import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './faq.css';


function FAQ() {
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
  ]

  return (
    <Box id="faq-section" sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        FAQ
      </Typography>
      <Typography variant="body1" paragraph>
        Here are some frequently asked questions:
      </Typography>
      {faqs.map((faq, index) => (
        <Accordion key={index} sx={{ marginBottom: '10px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ color: '#0095fd' }}>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default FAQ;