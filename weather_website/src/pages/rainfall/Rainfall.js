import React, { useState, useEffect } from "react"; 
import axios from "axios"; 
import Plot from "react-plotly.js"; 
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; 
import Modal from "react-modal"; 
import "./Rainfall.css"; 

// Setting the root element for the modal
Modal.setAppElement("#root");

function Rainfall() {
  // State variables to manage inputs and predictions
  const [maxTemp, setMaxTemp] = useState(""); // Maximum temperature input
  const [minTemp, setMinTemp] = useState(""); // Minimum temperature input
  const [rainfall, setRainfall] = useState(""); // Previous day's rainfall input
  const [prediction, setPrediction] = useState(null); // Rain prediction result
  const [score, setScore] = useState(null); // Confidence score for the prediction
  const [probabilities, setProbabilities] = useState({
    rainy_days: [], // Array for rainy days
    non_rainy_days: [], // Array for non-rainy days
  });
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal open state
  const [isChartOpen, setIsChartOpen] = useState(false); // State for chart visibility
  const [errors, setErrors] = useState({}); // Error state for form validation

  // Function to validate the input fields
  const validateInputs = () => {
    const errors = {};

    // Validate maximum temperature
    if (maxTemp === "" || isNaN(maxTemp) || maxTemp < -50 || maxTemp > 60) {
      errors.maxTemp = "Maximum temperature must be between -50 and 60°C.";
    }

    // Validate minimum temperature
    if (minTemp === "" || isNaN(minTemp) || minTemp < -50 || minTemp > 60) {
      errors.minTemp = "Minimum temperature must be between -50 and 60°C.";
    }

    // Validate that maxTemp is greater than minTemp
    if (parseFloat(maxTemp) <= parseFloat(minTemp)) {
      errors.minTemp = "Minimum temperature must be less than maximum temperature.";
      errors.maxTemp = "Maximum temperature must be greater than minimum temperature.";
    }

    // Validate rainfall
    if (rainfall === "" || isNaN(rainfall) || rainfall < 0) {
      errors.rainfall = "Rainfall must be a non-negative number.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetching the probability distribution data on component mount
  useEffect(() => {
    const fetchProbabilityDistribution = async () => {
      try {
        // Making an API call to get the probability distribution
        const response = await axios.get(
          "http://localhost:8000/probability_distribution"
        );
        setProbabilities(response.data); // Setting the response data to state
      } catch (error) {
        console.error("Error fetching probability distribution:", error); // Logging errors
      } finally {
        setLoading(false); // Setting loading to false after data fetch
      }
    };

    fetchProbabilityDistribution(); // Calling the function to fetch data
  }, []); // Empty dependency array means this runs once after the initial render

  // Function to handle form submission for predicting rain
  const handleSubmit = async (e) => {
    e.preventDefault(); // Preventing the default form submission behavior

    if (!validateInputs()) return; // Prevent submission if validation fails

    try {
      // Sending a POST request with the temperature and rainfall data
      const response = await axios.post("http://localhost:8000/rain_prediction",
        {
          max_temp: parseFloat(maxTemp), 
          min_temp: parseFloat(minTemp),
          rainfall: parseFloat(rainfall),
        }
      );

      // Setting prediction and score based on the response
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

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="rainfall-form">
      <h2 className="rainfall-title">Rainfall Prediction Model</h2>
      <hr />
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
          className="chart-toggle"
          onClick={() => setIsChartOpen(!isChartOpen)} // Toggling the chart visibility
        >
          {isChartOpen
            ? "Hide Probability Distribution"
            : "Show Probability Distribution"}
          <ExpandMoreIcon
            className={`chart-icon ${isChartOpen ? "open" : "closed"}`} // Changing icon based on chart state
          />
        </div>

        {/* Chart Content */}
        {isChartOpen && !loading && (
          <div className="chart-container">
            <Plot
              data={[ // Plotting the probability distribution chart
                {
                  x: ["Rainy Days", "Non-Rainy Days"], // X-axis categories
                  y: [
                    probabilities.rainy_days.length > 0
                      ? probabilities.rainy_days[0]
                      : 0,
                    probabilities.non_rainy_days.length > 0
                      ? probabilities.non_rainy_days[0]
                      : 0,
                  ],
                  type: "bar", // Bar chart type
                  marker: { color: ["blue", "orange"] }, // Color for bars
                },
              ]}
              layout={{
                title: "Probability Distribution of Rainfall", // Chart title
                xaxis: { title: "Weather Type" }, // X-axis label
                yaxis: { title: "Count" }, // Y-axis label
                barmode: "group", // Grouping bars
              }}
            />
          </div>
        )}

        {loading && <p>Loading probability data, please wait...</p>} {/* Loading message */}

        {/* Prediction Form */}
        <h2 className="rainfall-section-title">Will it Rain Tomorrow?</h2>
        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-group">
            <label htmlFor="maxTemp">Maximum Temperature (°C):</label>
            <input
              type="number"
              id="maxTemp"
              value={maxTemp} // Binding input to state
              onChange={(e) => setMaxTemp(e.target.value)} // Updating state on input change
              required
              className="input-field" // Styling for input
            />
             {errors.maxTemp && <p className="error-message">{errors.maxTemp}</p>} {/* Error message for invalid input */}
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
            {errors.minTemp && <p className="error-message">{errors.minTemp}</p>} {/* Error message for invalid input */}
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
            {errors.rainfall && <p className="error-message">{errors.rainfall}</p>} {/* Error message for invalid input */}
          </div>
          <button type="submit" className="submit-button">
            Predict
          </button>
          {errors.general && <p className="error-message">{errors.general}</p>}
        </form>
      </section>

      {/* Modal for displaying prediction results */}
      <Modal
        isOpen={modalIsOpen} // Controlling modal visibility
        onRequestClose={closeModal} // Function to close modal
        contentLabel="Prediction Result" // Accessibility label for modal
        className="prediction-modal" // Styling for modal
        overlayClassName="prediction-modal-overlay" // Styling for modal overlay
      >
        <h2 className="prediction-result">Prediction Result</h2>
        <p className="prediction-text">
          {prediction === "Yes"
            ? "Yes, it will rain."
            : prediction === "No"
            ? "No, it will not rain."
            : "Error in prediction"} {/* Displaying prediction result */}
        </p>
        {score !== null && ( // Conditionally rendering confidence score
          <p className="confidence-score">
            Confidence Score: {score.toFixed(2)} {/* Formatting score */}
          </p>
        )}
        <button onClick={closeModal} className="close-button">Close</button> {/* Button to close modal */}
      </Modal>
    </div>
  );
}

export default Rainfall; // Exporting the Rainfall component
