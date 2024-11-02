import React, { useState, useEffect } from "react"; // For building the component and managing state
import axios from "axios"; // For making HTTP requests
import Plot from 'react-plotly.js'; // For rendering Plotly charts
import Modal from "react-modal"; // For displaying modal dialogs
import "./Rainfall.css"; // For importing your CSS styles

// Set the root element for the modal
Modal.setAppElement("#root");

function Rainfall() {
  const [maxTemp, setMaxTemp] = useState(""); // State for maximum temperature input
  const [minTemp, setMinTemp] = useState(""); // State for minimum temperature input
  const [rainfall, setRainfall] = useState(""); // State for previous day's rainfall input
  const [prediction, setPrediction] = useState(null); // State for the prediction result
  const [score, setScore] = useState(null); // State for the confidence score
  const [probabilities, setProbabilities] = useState({ rainy_days: [], non_rainy_days: [] }); // State to hold probabilities
  const [loading, setLoading] = useState(true); // State to handle loading
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to manage modal visibility

  // Fetch probability distribution when the component mounts
  useEffect(() => {
    const fetchProbabilityDistribution = async () => {
      try {
        const response = await axios.get("http://localhost:8000/probability_distribution");
        console.log("Probability distribution data:", response.data);
        setProbabilities(response.data);
      } catch (error) {
        console.error("Error fetching probability distribution:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProbabilityDistribution();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/rain_prediction",
        {
          max_temp: parseFloat(maxTemp),
          min_temp: parseFloat(minTemp),
          rainfall: parseFloat(rainfall),
        }
      );

      // Log the response to check its structure
      console.log("Response from API:", response.data);

      // Update prediction and score directly from the response
      setPrediction(response.data.will_rain);
      setScore(response.data.score); // No conversion needed here
      // Open the modal to show the prediction result
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error");
      setScore(null);
      setModalIsOpen(true); // Open the modal to show the error message
    }
  };


  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="rainfall-form">
      <h2 className="rainfall-title">Rainfall Prediction Model</h2>

      {/* Description Section */}
      <section className="description-section">
        <h2 className="rainfall-section-title">Description</h2>
        <p className="rainfall-description-text">
          Welcome to our Rainfall Prediction Model! Our cutting-edge tool utilizes advanced binary classification machine learning techniques to forecast the likelihood of rain based on the data you provide. Whether you're planning a picnic, organizing an outdoor event, or just want to stay dry, our model offers accurate predictions tailored to your specific location and input data.
          <br />
          <br />
          Simply enter the relevant details, and our system will analyze historical weather patterns and current conditions to determine the probability of rainfall. With user-friendly functionality and real-time updates, you can make informed decisions and stay ahead of the weather. Experience the power of data-driven forecasting and never get caught in the rain again!
        </p>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <h2 className="rainfall-section-title">Charts</h2>

        {/* Loading Indicator */}
        {loading ? (
          <div className="loading-indicator">
            <p>Loading probability data, please wait...</p>
          </div>
        ) : (
          <div className="probability-chart">
            <h3>Probability Distribution</h3>
            <Plot
              data={[
                {
                  x: ['Rainy Days', 'Non-Rainy Days'],
                  y: [
                    probabilities.rainy_days.length > 0 ? probabilities.rainy_days[0] : 0,   // Count of rainy days
                    probabilities.non_rainy_days.length > 0 ? probabilities.non_rainy_days[0] : 0 // Count of non-rainy days
                  ],
                  type: 'bar',
                  marker: { color: ['blue', 'orange'] },
                },
              ]}
              layout={{ 
                title: 'Probability Distribution of Rainfall',
                xaxis: { title: 'Weather Type' },
                yaxis: { title: 'Count' },
                barmode: 'group',
              }}
            />
          </div>
        )}

        {/* Will it Rain Tomorrow? Section */}
        <h2 className="rainfall-section-title">Will it Rain Tomorrow?</h2>

        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-group">
            <label htmlFor="maxTemp">
              Maximum Temperature (°C):
              <input
                type="number"
                id="maxTemp"
                value={maxTemp}
                onChange={(e) => setMaxTemp(e.target.value)}
                required
                className="input-field"
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="minTemp">
              Minimum Temperature (°C):
              <input
                type="number"
                id="minTemp"
                value={minTemp}
                onChange={(e) => setMinTemp(e.target.value)}
                required
                className="input-field"
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="rainfall">
              Previous Day Rainfall (mm):
              <input
                type="number"
                id="rainfall"
                value={rainfall}
                onChange={(e) => setRainfall(e.target.value)}
                required
                className="input-field"
              />
            </label>
          </div>
          <button type="submit" className="submit-button">
            Predict
          </button>
        </form>
      </section>

      {/* Modal for displaying prediction results */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Prediction Result"
        className="prediction-modal"
        overlayClassName="prediction-modal-overlay"
      >
        <h2>Prediction Result</h2>
        <p className="prediction-text">
          {prediction === "Yes"
            ? "Yes, it will rain."
            : prediction === "No"
            ? "No, it will not rain."
            : "Error in prediction"}
        </p>
        {score !== null && (
          <p className="confidence-score">Confidence Score: {score.toFixed(2)}</p>
        )}
        <button onClick={closeModal} className="close-button">Close</button>
      </Modal>
    </div>
  );
}

export default Rainfall;