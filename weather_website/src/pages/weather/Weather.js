import React, { useState } from "react";
import "./Weather.css";
import axios from "axios";
import Modal from "react-modal";
import Chart from "./Chart";
// Set the root element for the modal
Modal.setAppElement("#root");

function Weather() {
  const [formData, setFormData] = useState({
    minimum_temp: "",
    maximum_temp: "",
    rainfall: "",
    nine_am_temp: "",
    nine_am_humidity: "",
    nine_am_cloud: "",
    nine_am_wind_speed: "",
    three_pm_temp: "",
    three_pm_humidity: "",
    three_pm_cloud: "",
    three_pm_wind_speed: "",
  });

  const [predictedCondition, setPredictedCondition] = useState(null);
  const [error, setError] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
const [chartData, setChartData] = useState([]); // State for chart data
  const validateInputs = () => {
    const errors = {};

    // Validate minimum temperature range
    if (
      formData.minimum_temp &&
      (formData.minimum_temp < -50 || formData.minimum_temp > 60)
    ) {
      errors.minimum_temp = "Minimum temperature must be between -50 and 60 °C";
    }

    // Validate maximum temperature range
    if (
      formData.maximum_temp &&
      (formData.maximum_temp < -50 || formData.maximum_temp > 60)
    ) {
      errors.maximum_temp = "Maximum temperature must be between -50 and 60 °C";
    }

    // Cross-validation: Ensure minimum temperature does not exceed maximum temperature
    if (
      formData.minimum_temp &&
      formData.maximum_temp &&
      parseFloat(formData.minimum_temp) > parseFloat(formData.maximum_temp)
    ) {
      errors.minimum_temp =
        "Minimum temperature cannot exceed maximum temperature";
      errors.maximum_temp =
        "Maximum temperature cannot be lower than minimum temperature";
    }

    // Validate rainfall as a non-negative value
    if (formData.rainfall < 0) {
      errors.rainfall = "Rainfall cannot be negative";
    }

    // Validate 9 AM temperature range
    if (formData.nine_am_temp < -50 || formData.nine_am_temp > 60) {
      errors.nine_am_temp = "9 AM temperature must be between -50 and 60 °C";
    }

    // Validate 9 AM humidity range
    if (formData.nine_am_humidity < 0 || formData.nine_am_humidity > 100) {
      errors.nine_am_humidity = "9 AM humidity must be between 0 and 100%";
    }

    // Validate 9 AM cloud amount range
      if (formData.nine_am_cloud < 0 || formData.nine_am_cloud > 8) {
      errors.nine_am_cloud = "9 AM cloud amount must be between 0 and 8 oktas";
    }

    // Validate 9 AM wind speed range
    if (formData.nine_am_wind_speed < 0) {
      errors.nine_am_wind_speed = "9 AM wind speed must be a non-negative value";
    }

    // Validate 3 PM temperature range
    if (formData.three_pm_temp < -50 || formData.three_pm_temp > 60) {
      errors.three_pm_temp = "3 PM temperature must be between -50 and 60 °C";
    }

    // Validate 3 PM humidity range
    if (formData.three_pm_humidity < 0 || formData.three_pm_humidity > 100) {
      errors.three_pm_humidity = "3 PM humidity must be between 0 and 100%";
    }

    // Validate 3 PM cloud amount range
    if (formData.three_pm_cloud < 0 || formData.three_pm_cloud > 8) {
      errors.three_pm_cloud = "3 PM cloud amount must be between 0 and 8 oktas";
    }

    // Validate 3 PM wind speed range
    if (formData.three_pm_wind_speed < 0) {
      errors.three_pm_wind_speed = "3 PM wind speed must be a non-negative value";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const preparedData = {
      minimum_temp: formData.minimum_temp
        ? parseFloat(formData.minimum_temp)
        : null,
      maximum_temp: formData.maximum_temp
        ? parseFloat(formData.maximum_temp)
        : null,
      rainfall: formData.rainfall ? parseFloat(formData.rainfall) : null,
      nine_am_temp: formData.nine_am_temp
        ? parseFloat(formData.nine_am_temp)
        : null,
      nine_am_humidity: formData.nine_am_humidity
        ? parseFloat(formData.nine_am_humidity)
        : null,
      nine_am_cloud: formData.nine_am_cloud
        ? parseFloat(formData.nine_am_cloud)
        : null,
      nine_am_wind_speed: formData.nine_am_wind_speed
        ? parseFloat(formData.nine_am_wind_speed)
        : null,
      three_pm_temp: formData.three_pm_temp
        ? parseFloat(formData.three_pm_temp)
        : null,
      three_pm_humidity: formData.three_pm_humidity
        ? parseFloat(formData.three_pm_humidity)
        : null,
      three_pm_cloud: formData.three_pm_cloud
        ? parseFloat(formData.three_pm_cloud)
        : null,
      three_pm_wind_speed: formData.three_pm_wind_speed
        ? parseFloat(formData.three_pm_wind_speed)
        : null,
    };

    console.log("Payload sent to FastAPI:", preparedData);

    try {
      const response = await axios.post(
        "http://localhost:8000/weather_prediction",
        preparedData
      );
      setPredictedCondition(response.data.predicted_weather_condition);
      setError({});
    } catch (err) {
      setError({
        general: "Failed to get prediction. Please try again later.",
      });
    } finally {
      setModalIsOpen(true);
    }
  };

  return (
    <div className="weather-form">
      <h2 className="weather-title">Weather Prediction Model</h2>

      {/* Description Section */}
      <section className="description-section">
        <h2 className="weather-section-title">Description</h2>
        <p className="weather-description">
          Our Weather Conditions Prediction Model offers a powerful tool for
          forecasting and understanding daily weather patterns. Utilizing
          advanced classification algorithms in machine learning, this model
          accurately predicts the type of weather expected in a given area.
        </p>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <h2 className="weather-section-title">Charts</h2>
        <Chart data={chartData} /> {/* Pass chart data to the Chart component */}
        
      </section>
      {/* Prediction Model Section */}
      <section className="prediction-model">
        <h2 className="weather-section-title">Prediction Model</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Minimum Temperature (°C):</label>
            <input
              type="number"
              name="minimum_temp"
              value={formData.minimum_temp}
              onChange={handleChange}
              required
            />
            {error?.minimum_temp && (
              <p className="error-message">{error.minimum_temp}</p>
            )}
          </div>
          <div>
            <label>Maximum Temperature (°C):</label>
            <input
              type="number"
              name="maximum_temp"
              value={formData.maximum_temp}
              onChange={handleChange}
              required
            />
            {error?.maximum_temp && (
              <p className="error-message">{error.maximum_temp}</p>
            )}
          </div>
          <div>
            <label>Rainfall (mm):</label>
            <input
              type="number"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleChange}
              required
            />
            {error?.rainfall && (
              <p className="error-message">{error.rainfall}</p>
            )}
          </div>
          {/* Optional fields for better user experience */}
          <div>
            <label>9 AM Temperature (°C):</label>
            <input
              type="number"
              name="nine_am_temp"
              value={formData.nine_am_temp}
              onChange={handleChange}
              placeholder="Optional"
            />
            {error?.nine_am_temp && (
              <p className="error-message">{error.nine_am_temp}</p>
            )}
          </div>
          <div>
            <label>9 AM Humidity (%):</label>
            <input
              type="number"
              name="nine_am_humidity"
              value={formData.nine_am_humidity}
              onChange={handleChange}
              placeholder="Optional"
            />
            {error?.nine_am_humidity && (
              <p className="error-message">{error.nine_am_humidity}</p>
            )}
          </div>
          <div>
            <label>9 AM Cloud Amount (oktas):</label>
            <input
              type="number"
              name="nine_am_cloud"
              value={formData.nine_am_cloud}
              onChange={handleChange}
              placeholder="Optional"
            />
            {error?.nine_am_cloud && (
              <p className="error-message">{error.nine_am_cloud}</p>
            )}
          </div>
          <div>
            <label>9 AM Wind Speed (km/h):</label>
            <input
              type="number"
              name="nine_am_wind_speed"
              value={formData.nine_am_wind_speed}
              onChange={handleChange}
              placeholder="Optional"
            />
            {error?.nine_am_wind_speed && (
              <p className="error-message">{error.nine_am_wind_speed}</p>
            )}
          </div>
          <div>
            <label>3 PM Temperature (°C):</label>
            <input
              type="number"
              name="three_pm_temp"
              value={formData.three_pm_temp}
              onChange={handleChange}
              placeholder="Optional"
            />
            {error?.three_pm_temp && (
              <p className="error-message">{error.three_pm_temp}</p>
            )}
          </div>
          <div>
            <label>3 PM Humidity (%):</label>
            <input
              type="number"
              name="three_pm_humidity"
              value={formData.three_pm_humidity}
              onChange={handleChange}
              placeholder="Optional"
            />
            {error?.three_pm_humidity && (
              <p className="error-message">{error.three_pm_humidity}</p>
            )}
          </div>
          <div>
            <label>3 PM Cloud Amount (oktas):</label>
            <input
              type="number"
              name="three_pm_cloud"
              value={formData.three_pm_cloud}
              onChange={handleChange}
              placeholder="Optional"
            />
            {error?.three_pm_cloud && (
              <p className="error-message">{error.three_pm_cloud}</p>
            )}
          </div>
          <div>
            <label>3 PM Wind Speed (km/h):</label>
            <input
              type="number"
              name="three_pm_wind_speed"
              value={formData.three_pm_wind_speed}
              onChange={handleChange}
              placeholder="Optional"
            />
            {error?.three_pm_wind_speed && (
              <p className="error-message">{error.three_pm_wind_speed}</p>
            )}
          </div>
          <button type="submit" className="submit-button">
            Predict
          </button>
        </form>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
        >
          {predictedCondition ? (
            <p>
              Predicted Weather Condition: <strong>{predictedCondition}</strong>
            </p>
          ) : error.general ? (
            <p className="error">{error.general}</p>
          ) : (
            <p className="error">Please check input fields for errors</p>
          )}
          <button onClick={() => setModalIsOpen(false)}>Close</button>
        </Modal>
      </section>
    </div>
  );
}

export default Weather;
