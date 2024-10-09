import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Header from './Header';
import Home from './pages/home/Home';
import Footer from './Footer';
import Heatwave from './pages/Models/Heatwave';
import Rainfall from './pages/Models/Rainfall';
import Weather from './pages/Models/Weather';
import Temperature from './pages/Models/Temperature';
import { BrowserRouter, Routes, Route } from "react-router-dom";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header/>
    <Home />
<BrowserRouter>
      <Routes>
        <Route path="/" element={<pages/>}>
          <Route index element={<Home />} />
          <Route path="Temperature" element={<Temperature />} />
          <Route path="Rainfall" element={<Rainfall />} />
          <Route path="Heatwave" element={<Heatwave />} />
          <Route path="Weather" element={<Weather />} />

          
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
    <Footer/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
