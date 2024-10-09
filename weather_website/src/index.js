import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Home from './pages/home/Home';
import { Heatwave, Rainfall } from './pages';
import Weather from './pages/weather/Weather';
import Temperature from './pages/temperature/Temperature';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from './NoPage';
import Layout from './Layout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path="temperature" element={<Temperature />} />
          <Route path="rainfall" element={<Rainfall />} />
          <Route path="heatwave" element={<Heatwave />} />
          <Route path="weather" element={<Weather />} />

          
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
