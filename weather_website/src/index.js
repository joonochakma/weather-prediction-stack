import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Importing the main CSS file for styling
import reportWebVitals from "./reportWebVitals"; // Performance measurement tool
import Home from "./pages/home/Home"; // Importing the Home component
import { Heatwave, Rainfall } from "./pages"; // Importing Heatwave and Rainfall components
import Weather from "./pages/weather/Weather"; // Importing the Weather component
import Temperature from "./pages/temperature/Temperature"; // Importing the Temperature component
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importing routing components
import NoPage from "./NoPage"; // Importing a component for handling 404 pages
import Layout from "./Layout"; // Importing the main layout component
import FAQ from "./pages/faq/FAQ"; // Importing the FAQ component
import About from "./pages/about/About"; // Importing the About component

// Creating the root element for the React app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Rendering the application with React.StrictMode for highlighting potential problems
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}> {/* Main layout for all routes */}
          <Route index element={<Home />} /> {/* Default route for the home page */}
          <Route path="home" element={<Home />} /> {/* Home page route */}
          <Route path="temperature" element={<Temperature />} /> {/* Temperature page route */}
          <Route path="rainfall" element={<Rainfall />} /> {/* Rainfall page route */}
          <Route path="heatwave" element={<Heatwave />} /> {/* Heatwave page route */}
          <Route path="weather" element={<Weather />} /> {/* Weather page route */}
          <Route path="about" element={<About />} /> {/* About page route */}
          <Route path="faq" element={<FAQ />} /> {/* FAQ page route */}
          <Route path="*" element={<NoPage />} /> {/* Catch-all for 404 pages */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// Optional performance measurement; can log results or send to an analytics endpoint
reportWebVitals();
