import React, { useState } from "react";
import axios from "axios";
import "./Rainfall.css"; // Import the external CSS file
import Modal from "react-modal";

// Set the root element for the modal
Modal.setAppElement("#root");

function Rainfall() {
  const [maxTemp, setMaxTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [score, setScore] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
          Welcome to our Rainfall Prediction Model! Our cutting-edge tool
          utilizes advanced binary classification machine learning techniques to
          forecast the likelihood of rain based on the data you provide. Whether
          you're planning a picnic, organizing an outdoor event, or just want to
          stay dry, our model offers accurate predictions tailored to your
          specific location and input data.
          <br />
          <br />
          Simply enter the relevant details, and our system will analyze
          historical weather patterns and current conditions to determine the
          probability of rainfall. With user-friendly functionality and
          real-time updates, you can make informed decisions and stay ahead of
          the weather. Experience the power of data-driven forecasting and never
          get caught in the rain again!
        </p>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <h2 className="rainfall-section-title">Charts</h2>

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
