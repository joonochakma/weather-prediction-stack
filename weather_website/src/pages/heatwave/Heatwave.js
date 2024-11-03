import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Plot from "react-plotly.js";
import "./Heatwave.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

Modal.setAppElement("#root"); // Set the root element for accessibility

const Heatwave = () => {
  // State variables for managing form inputs and prediction results
  const [minTemp, setMinTemp] = useState(""); // Minimum temperature input
  const [maxTemp, setMaxTemp] = useState(""); // Maximum temperature input
  const [date, setDate] = useState(""); // Date input for prediction
  const [prediction, setPrediction] = useState(null); // Holds prediction result
  const [error, setError] = useState(""); // For storing error messages
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for prediction result modal
  const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false); // State for details modal
  const [clusterData, setClusterData] = useState({ x: [], y: [], cluster: [] }); // State for cluster data
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [isOpen, setIsOpen] = useState(false); // Toggle state for expandable section

  // Function to validate user inputs before submitting the form
  const validateInputs = () => {
    let validationErrors = '';
    const minTemperature = parseFloat(minTemp);
    const maxTemperature = parseFloat(maxTemp);

    // Validate minimum temperature input is a number between -50 and 60 °C 
    if (isNaN(minTemperature) || minTemperature < -50 || minTemperature > 60) {
      validationErrors = 'Minimum temperature must be between -50 and 60 °C.';
    } 
    
    // Validate maximum temperature input is a number between -50 and 60 °C
    if (isNaN(maxTemperature) || maxTemperature < -50 || maxTemperature > 60) {
      validationErrors = 'Maximum temperature must be between -50 and 60 °C.';
    } 
    
    // Validate maximum temperature is greater than minimum temperature
    if (minTemperature >= maxTemperature) {
      validationErrors = 'Maximum temperature must be greater than minimum temperature.';
    } 
    
    // Validate date input is not empty
    if (!date) {
      validationErrors = 'Please select a valid date.';
    }

    setError(validationErrors);
    return validationErrors === '';
  };

  // Fetch cluster data when the component mounts
  useEffect(() => {
    fetchClusterVisualization();
  }, []);

  // Handle form submission to fetch heatwave predictions
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) { // Validate user inputs before fetching prediction
      return;
    }

    try {
      // Sending a POST request to fetch prediction data based on user input
      const response = await fetch(
        `http://127.0.0.1:8000/heatwave_prediction?date=${date}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            min_temp: parseFloat(minTemp),
            max_temp: parseFloat(maxTemp),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok"); // Error handling for network issues
      }

      const data = await response.json(); // Parse the JSON response
      setPrediction(data);
      setError("");
      setModalIsOpen(true);
    } catch (err) {
      console.error("Error:", err); // Log any errors to the console
      setError("Error fetching prediction. Please try again."); // Set error message for user
      setPrediction(null); // Clear previous prediction on error
    }
  };

  // Function to fetch cluster visualization data
  const fetchClusterVisualization = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/clusters_visualization"
      );
      console.log("Response status:", response.status); // Log the response status for debugging

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Handle any errors
      }

      const data = await response.json(); // Parse the JSON response
      console.log("Cluster data:", data); // Log the cluster data for debugging

      // Update state with the received cluster data
      setClusterData(data);
      setLoading(false); // Update loading state
    } catch (error) {
      console.error("Error fetching cluster visualization:", error); // Log any errors
      setLoading(false); // Update loading state even on error
    }
  };

  // Close the prediction result modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Open the details modal for more information
  const openDetailsModal = () => {
    setDetailsModalIsOpen(true);
  };

  // Close the details modal
  const closeDetailsModal = () => {
    setDetailsModalIsOpen(false);
  };

  // Function to determine cluster colors for visualization
  const getClusterColors = (clusters) => {
    return clusters.map((cluster) => (cluster === 0 ? "blue" : "red")); // Set colors based on cluster value
  };

  return (
    <div className="heatwave-form">
      <h2 className="heatwave-title">Heatwave Prediction Model</h2>
      <hr />
      {/* Description Section */}
      <section className="description-section">
        <h2 className="heatwave-section-title">Description</h2>
        <p className="heatwave-description">
          Our <strong>Heatwave Prediction Model</strong> is designed to help communities,
          industries, and individuals prepare for extreme weather events.
          Leveraging <em>advanced machine learning techniques</em>, this model uses the
          <strong> K-Means clustering algorithm</strong> to accurately forecast 
          <strong> heatwave occurrences</strong>. By analyzing large datasets of historical weather
          patterns, temperature trends, and geographical factors, our model
          identifies key indicators of impending heatwaves.
        </p>
      </section>
      <section className="charts-section">
        <h2 className="heatwave-section-title">Charts</h2>
        {/* Expandable section for prediction and cluster visualization */}
        <div
          className="expandable-section"
          onClick={() => setIsOpen(!isOpen)} // Toggle open/close on click
        >
          {isOpen
            ? "Hide Prediction and Cluster Visualization"
            : "Show Prediction and Cluster Visualization"}
          <ExpandMoreIcon
            style={{
              marginLeft: "auto",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", // Rotate icon based on section state
              transition: "transform 0.3s ease",
            }}
          />
        </div>

        {/* Display prediction and cluster data if section is open */}
        {isOpen && (
          <div style={{ marginTop: "20px" }}>
            {prediction && ( // If prediction exists, display it
              <div>
                <h3>Prediction Result</h3>
                <p>Date: {prediction.date}</p>
                <p>Minimum Temperature: {prediction.minimum_temperature} °C</p>
                <p>Maximum Temperature: {prediction.maximum_temperature} °C</p>
                <p>Predicted Cluster: {prediction.cluster}</p>
                <p>
                  {prediction.cluster === 1
                    ? "Heatwave is occurring!" // Message based on cluster prediction
                    : "No heatwave."}
                </p>
              </div>
            )}

            {clusterData.x.length > 0 && clusterData.y.length > 0 ? (
              <Plot
                className="plot-container"
                data={[
                  {
                    x: clusterData.x,
                    y: clusterData.y,
                    mode: "markers",
                    type: "scatter",
                    marker: {
                      color: getClusterColors(clusterData.cluster), // Get colors based on clusters
                      size: 10,
                      opacity: 0.8,
                    },
                    text: clusterData.cluster.map(
                      (cluster) => `Cluster: ${cluster}` // Display cluster info on hover
                    ),
                  },
                ]}
                layout={{
                  width: 800,
                  height: 400,
                  title: "Clusters of Temperature Data",
                  xaxis: { title: "PCA 1" }, // Label for x-axis
                  yaxis: { title: "PCA 2" }, // Label for y-axis
                }}
              />
            ) : (
              <p>No cluster data available.</p> // Message if no cluster data is found
            )}
          </div>
        )}
      </section>

      {/* Prediction Model Section */}
      <section className="prediction-model">
        <h2 className="temperature-section-title">Prediction Model</h2>
        <form onSubmit={handleSubmit}>
          {" "}
          {/* Form for user input */}
          <div>
            <label>
              Minimum Temperature (°C):
              <input
                type="number"
                value={minTemp} // Controlled input for minimum temperature
                onChange={(e) => setMinTemp(e.target.value)} // Update state on change
                required
              />
            </label>
          </div>
          <div>
            <label>
              Maximum Temperature (°C):
              <input
                type="number"
                value={maxTemp} // Controlled input for maximum temperature
                onChange={(e) => setMaxTemp(e.target.value)} // Update state on change
                required
              />
            </label>
          </div>
          <div>
            <label>
              Date (YYYY-MM-DD):
              <input
                type="date"
                value={date} // Controlled input for date
                onChange={(e) => setDate(e.target.value)} // Update state on change
                required
              />
            </label>
          </div>
          <button className="submit-button" type="submit">
            Predict
          </button>
        </form>
        
        {/* Display error message if any */}
        {error && <p className="error-message">{error}</p>}

        {/* Modal for displaying prediction result */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Prediction Result"
        >
          {prediction && (
            <div className="heatwave-result">
              <h3>Prediction Result</h3>
              <p>Date: {prediction.date}</p>
              <p>Minimum Temperature: {prediction.minimum_temperature} °C</p>
              <p>Maximum Temperature: {prediction.maximum_temperature} °C</p>
              <p>Predicted Cluster: {prediction.cluster}</p>
              <p>
                {prediction.cluster === 1
                  ? "Heatwave is occurring!" // Message based on prediction
                  : "No heatwave."}
              </p>
              <div className="button-container">
                <button className="detail-button" onClick={openDetailsModal}>
                  More Details
                </button>
              </div>
            </div>
          )}
          <button className="close-button" onClick={closeModal}>
            Close
          </button>
        </Modal>
        {/* Nested Modal for additional details about heatwaves */}
        <Modal
          isOpen={detailsModalIsOpen}
          onRequestClose={closeDetailsModal}
          contentLabel="More Details"
        >
          <h3>More About Heatwaves</h3>
          <p>
            A heatwave is defined as a prolonged period of excessively hot
            weather, which may be accompanied by high humidity.
          </p>
          <button onClick={closeDetailsModal}>Close</button>
        </Modal>
      </section>
    </div>
  );
};

export default Heatwave; // Export the component for use in other parts of the application
