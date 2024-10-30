import React from 'react'; 
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import './faq.css'; // Import the CSS file

// Styled Container Component for the FAQ section
const FAQContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: { // Responsive design for small screens
    padding: '10px', 
  },
}));

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
    <FAQContainer id="faq-section" className="faq-container">
      <Typography 
        variant="h4" 
        gutterBottom 
        className={`faq-title ${window.innerWidth < 600 ? 'sm' : ''}`}
      >
        FAQ
      </Typography>
      <Typography 
        variant="body1" 
        className={`faq-description ${window.innerWidth < 600 ? 'sm' : ''}`}
      >
        Here are some frequently asked questions:
      </Typography>
      {faqs.map((faq, index) => ( // Loop through the FAQ array
        <Accordion key={index} className="accordion">
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#1976d2' }} />}>
            <Typography 
              variant="h6" 
              className={`faq-question ${window.innerWidth < 600 ? 'sm' : ''}`}
            >
              {faq.question}
            </Typography> 
          </AccordionSummary>
          <AccordionDetails>
            <Typography className={`faq-answer ${window.innerWidth < 600 ? 'sm' : ''}`}>
              {faq.answer}
            </Typography> 
          </AccordionDetails>
        </Accordion>
      ))}
    </FAQContainer>
  );
};

export default FAQ;