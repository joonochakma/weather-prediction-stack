import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Modal from "react-modal";
import "./Rainfall.css";

Modal.setAppElement("#root");

function Rainfall() {
  const [maxTemp, setMaxTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [score, setScore] = useState(null);
  const [probabilities, setProbabilities] = useState({
    rainy_days: [],
    non_rainy_days: [],
  });
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);

  useEffect(() => {
    const fetchProbabilityDistribution = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/probability_distribution"
        );
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
      const response = await axios.post(
        "http://localhost:8000/rain_prediction",
        {
          max_temp: parseFloat(maxTemp),
          min_temp: parseFloat(minTemp),
          rainfall: parseFloat(rainfall),
        }
      );

      setPrediction(response.data.will_rain);
      setScore(response.data.score);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error");
      setScore(null);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="rainfall-form">
      <h2 className="rainfall-title">Rainfall Prediction Model</h2>
      <hr></hr>
      {/* Description Section */}
      <section className="description-section">
        <h2 className="rainfall-section-title">Description</h2>
        <p className="rainfall-description-text">
          Welcome to our <strong>Rainfall Prediction Model!</strong> Our cutting-edge tool
          utilizes <em>advanced binary classification</em> machine learning techniques to
          forecast the <strong>likelihood of rain</strong> based on the data you provide. Whether
          you're planning a picnic, organizing an outdoor event, or just want to
          stay dry, our model offers accurate predictions tailored to your
          specific location and input data.
          <br />
          <br />
          Simply enter the relevant details, and our system will analyze
          historical weather patterns and current conditions to determine the 
          <strong> probability of rainfall</strong>. With user-friendly functionality and
          real-time updates, you can make <em>informed decisions</em> and stay ahead of
          the weather. Experience the power of data-driven forecasting and never
          get caught in the rain again!
        </p>
      </section>

      {/* Collapsible Chart Section */}
      <section className="charts-section">
        <h2 className="rainfall-section-title">Charts</h2>

        {/* Toggle for Probability Distribution Chart */}
        <div
          onClick={() => setIsChartOpen(!isChartOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            padding: "1em",
            backgroundColor: "#ECF6FE",
            border: "1px solid #ccc",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#1870C9",
            borderRadius:"5px",
            margin:" 0 10%"
          }}
        >
          {isChartOpen
            ? "Hide Probability Distribution"
            : "Show Probability Distribution"}
          <ExpandMoreIcon
            style={{
              marginLeft: "auto",
              transform: isChartOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>

        {/* Chart Content */}
        {isChartOpen && !loading && (
          <div
            style={{
              padding: "1em",
              border: "1px solid #ccc",
              borderTop: "none",
              margin: "0 10%"
            }}
          >
            <Plot
              data={[
                {
                  x: ["Rainy Days", "Non-Rainy Days"],
                  y: [
                    probabilities.rainy_days.length > 0
                      ? probabilities.rainy_days[0]
                      : 0,
                    probabilities.non_rainy_days.length > 0
                      ? probabilities.non_rainy_days[0]
                      : 0,
                  ],
                  type: "bar",
                  marker: { color: ["blue", "orange"] },
                },
              ]}
              layout={{
                title: "Probability Distribution of Rainfall",
                xaxis: { title: "Weather Type" },
                yaxis: { title: "Count" },
                barmode: "group",
              }}
            />
          </div>
        )}

        {loading && <p>Loading probability data, please wait...</p>}

        {/* Prediction Form */}
        <h2 className="rainfall-section-title">Will it Rain Tomorrow?</h2>
        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-group">
            <label htmlFor="maxTemp">Maximum Temperature (°C):</label>
            <input
              type="number"
              id="maxTemp"
              value={maxTemp}
              onChange={(e) => setMaxTemp(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="minTemp">Minimum Temperature (°C):</label>
            <input
              type="number"
              id="minTemp"
              value={minTemp}
              onChange={(e) => setMinTemp(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="rainfall">Previous Day Rainfall (mm):</label>
            <input
              type="number"
              id="rainfall"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              required
              className="input-field"
            />
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
        <h2 className="prediction-result">Prediction Result</h2>
        <p className="prediction-text">
          {prediction === "Yes"
            ? "Yes, it will rain."
            : prediction === "No"
            ? "No, it will not rain."
            : "Error in prediction"}
        </p>
        {score !== null && (
          <p className="confidence-score">
            Confidence Score: {score.toFixed(2)}
          </p>
        )}
        <button onClick={closeModal} className="close-button">
          Close
        </button>
      </Modal>
    </div>
  );
}

export default Rainfall;
