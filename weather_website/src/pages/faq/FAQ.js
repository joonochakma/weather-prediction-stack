import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FAQ() {
  const faqs = [
    {
      question: "What is this website about?",
      answer: "This website provides weather-related information including temperature, weather condition, rainfall prediction, and more."
    },
    {
      question: "Where can I find temperature data?",
      answer: "Temperature data is available under the 'Temperature' section in the models dropdown menu."
    },
    {
      question: "What is forecasting?",
      answer: "A calculation or estimate of future events, especially upcoming weather."
    }
  ];

  const menuItems = [
    { name: 'Rainfall', link: '/rainfall' },
    { name: 'Temperature', link: '/temperature' },
    { name: 'Weather Conditions', link: '/weather' },
    { name: 'Heatwave', link: '/heatwave' }
  ]
    return (
      <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        FAQ
      </Typography>
      <Typography variant="body1" paragraph>
        Here are some frequently asked questions:
      </Typography>
      // Display FAQs using Accordion component
      {faqs.map((faq, index) => (
        <Accordion key={index} sx={{ marginBottom: '10px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
    );
  }
  
  export default FAQ;