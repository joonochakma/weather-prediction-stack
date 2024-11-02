import React, { useState } from 'react';
import axios from 'axios';
import './Rainfall.css';

function Rainfall() {
  const [maxTemp, setMaxTemp] = useState('');
  const [minTemp, setMinTemp] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [score, setScore] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/rain_prediction", {
        max_temp: parseFloat(maxTemp),
        min_temp: parseFloat(minTemp),
        rainfall: parseFloat(rainfall),
      });

      // Log the response to check its structure
      console.log("Response from API:", response.data);

      // Update prediction and score directly from the response
      setPrediction(response.data.will_rain);
      setScore(response.data.score); // No conversion needed here
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error");
      setScore(null);
    }
  };

  return (
    <div className="rainfall-form" style={{ textAlign: 'center', padding: '20px' }}>
      <h2 className="rainfall-title">Will it Rain Tomorrow?</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Maximum Temperature (°C):
            <input
              type="number"
              value={maxTemp}
              onChange={(e) => setMaxTemp(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Minimum Temperature (°C):
            <input
              type="number"
              value={minTemp}
              onChange={(e) => setMinTemp(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Previous Day Rainfall (mm):
            <input
              type="number"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Predict</button>
      </form>

      {prediction && (
        <div style={{ marginTop: '20px' }}>
          <h3>Prediction:</h3>
          <p>{prediction === "Yes" ? "Yes, it will rain." : "No, it will not rain."}</p>
          {score !== null && (
            <p>Confidence Score: {score}</p> 
          )}
        </div>
      )}
    </div>
  );
}

export default Rainfall;