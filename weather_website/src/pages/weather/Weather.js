import React, {useState} from 'react';
import './Weather.css';
import axios from 'axios';
import Modal from 'react-modal';

// Set the root element for the modal
Modal.setAppElement('#root');

function Weather() {
  const [formData, setFormData] = useState({
      minimum_temp: '',
      maximum_temp: '',
      rainfall: '',
      nine_am_temp: '',
      nine_am_humidity: '',
      nine_am_cloud: '',
      nine_am_wind_speed: '',
      three_pm_temp: '',
      three_pm_humidity: '',
      three_pm_cloud: '',
      three_pm_wind_speed: '',
  });

  const [predictedCondition, setPredictedCondition] = useState(null);
  const [error, setError] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const validateInputs = () => {
      const errors = {};

      if (formData.minimum_temp && (formData.minimum_temp < -50 || formData.minimum_temp > 60)) {
          errors.minimum_temp = "Minimum temperature must be between -50 and 60 °C";
      }
      if (formData.maximum_temp && (formData.maximum_temp < -50 || formData.maximum_temp > 60)) {
          errors.maximum_temp = "Maximum temperature must be between -50 and 60 °C";
      }
      if (formData.minimum_temp && formData.maximum_temp && parseFloat(formData.minimum_temp) > parseFloat(formData.maximum_temp)) {
          errors.minimum_temp = "Minimum temperature cannot exceed maximum temperature";
          errors.maximum_temp = "Maximum temperature cannot be lower than minimum temperature";
      }
      if (formData.rainfall < 0) {
          errors.rainfall = "Rainfall cannot be negative";
      }
      if (formData.nine_am_humidity < 0 || formData.nine_am_humidity > 100) {
          errors.nine_am_humidity = "9 AM humidity must be between 0 and 100%";
      }
      if (formData.three_pm_humidity < 0 || formData.three_pm_humidity > 100) {
          errors.three_pm_humidity = "3 PM humidity must be between 0 and 100%";
      }
      if (formData.nine_am_cloud < 0 || formData.nine_am_cloud > 8) {
          errors.nine_am_cloud = "9 AM cloud amount must be between 0 and 8 oktas";
      }
      if (formData.three_pm_cloud < 0 || formData.three_pm_cloud > 8) {
          errors.three_pm_cloud = "3 PM cloud amount must be between 0 and 8 oktas";
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
          setModalIsOpen(true);
          return;
      }

      //Default values for optional fields in the request, these will be used if the user does not provide them
      //These values are the mean values from the training data
      const DEFAULT_9AM_TEMP = 14.29
      const DEFAULT_9AM_HUMIDITY = 73.47
      const DEFAULT_9AM_CLOUD = 5.14
      const DEFAULT_9AM_WIND_SPEED = 9.70
      const DEFAULT_3PM_TEMP = 18.64
      const DEFAULT_3PM_HUMIDITY = 57.28
      const DEFAULT_3PM_CLOUD = 4.82
      const DEFAULT_3PM_WIND_SPEED = 13.57

      const preparedData = {
        minimum_temp: formData.minimum_temp ? parseFloat(formData.minimum_temp) : null,
        maximum_temp: formData.maximum_temp ? parseFloat(formData.maximum_temp) : null,
        rainfall: formData.rainfall ? parseFloat(formData.rainfall) : null,
        nine_am_temp: formData.nine_am_temp ? parseFloat(formData.nine_am_temp) : null,
        nine_am_humidity: formData.nine_am_humidity ? parseFloat(formData.nine_am_humidity) : null,
        nine_am_cloud: formData.nine_am_cloud ? parseFloat(formData.nine_am_cloud) : null,
        nine_am_wind_speed: formData.nine_am_wind_speed ? parseFloat(formData.nine_am_wind_speed) : null,
        three_pm_temp: formData.three_pm_temp ? parseFloat(formData.three_pm_temp) : null,
        three_pm_humidity: formData.three_pm_humidity ? parseFloat(formData.three_pm_humidity) : null,
        three_pm_cloud: formData.three_pm_cloud ? parseFloat(formData.three_pm_cloud) : null,
        three_pm_wind_speed: formData.three_pm_wind_speed ? parseFloat(formData.three_pm_wind_speed) : null,
      };

      console.log("Payload sent to FastAPI:", preparedData);

      try {
          const response = await axios.post("http://localhost:8000/weather_prediction", preparedData);
          setPredictedCondition(response.data.predicted_weather_condition);
          setError({});
      } catch (err) {
          setError({ general: "Failed to get prediction. Please try again later." });
      } finally {
          setModalIsOpen(true);
      }
  };

  return (
    <div className="weather-container">
      <h2 className="model_title">Weather Conditions Prediction</h2>
      <p className="model_description">Classify weather conditions based on provide data. Provide data for all fields for better precision</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Minimum Temperature (°C):</label>
            <input type="number" name="minimum_temp" value={formData.minimum_temp} onChange={handleChange} required />
            {error?.minimum_temp && <p className="error-message">{error.minimum_temp}</p>}
          </div>
          <div>
            <label>Maximum Temperature (°C):</label>
            <input type="number" name="maximum_temp" value={formData.maximum_temp} onChange={handleChange} required />
            {error?.maximum_temp && <p className="error-message">{error.maximum_temp}</p>}
          </div>
          <div>
            <label>Rainfall (mm):</label>
            <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} required />
            {error?.rainfall && <p className="error-message">{error.rainfall}</p>}
          </div>
          {/* Optional fields for better user experience */}
          <div>
            <label>9 AM Temperature (°C):</label>
            <input type="number" name="nine_am_temp" value={formData.nine_am_temp} onChange={handleChange} placeholder="Optional" />
            {error?.nine_am_temp && <p className="error-message">{error.nine_am_temp}</p>}
          </div>
          <div>
            <label>9 AM Humidity (%):</label>
            <input type="number" name="nine_am_humidity" value={formData.nine_am_humidity} onChange={handleChange} placeholder="Optional" />
            {error?.nine_am_humidity && <p className="error-message">{error.nine_am_humidity}</p>}
          </div>
          <div>
            <label>9 AM Cloud Amount (oktas):</label>
            <input type="number" name="nine_am_cloud" value={formData.nine_am_cloud} onChange={handleChange} placeholder="Optional" />
            {error?.nine_am_cloud && <p className="error-message">{error.nine_am_cloud}</p>}
          </div>
          <div>
            <label>9 AM Wind Speed (km/h):</label>
            <input type="number" name="nine_am_wind_speed" value={formData.nine_am_wind_speed} onChange={handleChange} placeholder="Optional" />
            {error?.nine_am_wind_speed && <p className="error-message">{error.nine_am_wind_speed}</p>}
          </div>
          <div>
            <label>3 PM Temperature (°C):</label>
            <input type="number" name="three_pm_temp" value={formData.three_pm_temp} onChange={handleChange} placeholder="Optional" />
            {error?.three_pm_temp && <p className="error-message">{error.three_pm_temp}</p>}
          </div>
          <div>
            <label>3 PM Humidity (%):</label>
            <input type="number" name="three_pm_humidity" value={formData.three_pm_humidity} onChange={handleChange} placeholder="Optional"/>
            {error?.three_pm_humidity && <p className="error-message">{error.three_pm_humidity}</p>}
          </div>
          <div>
            <label>3 PM Cloud Amount (oktas):</label>
            <input type="number" name="three_pm_cloud" value={formData.three_pm_cloud} onChange={handleChange} placeholder="Optional" />
            {error?.three_pm_cloud && <p className="error-message">{error.three_pm_cloud}</p>}
          </div>
          <div>
            <label>3 PM Wind Speed (km/h):</label>
            <input type="number" name="three_pm_wind_speed" value={formData.three_pm_wind_speed} onChange={handleChange}  placeholder="Optional" />
            {error?.three_pm_wind_speed && <p className="error-message">{error.three_pm_wind_speed}</p>}
          </div>
          <button type="submit" className='submit-button'>Predict</button>
        </form>

        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
          {predictedCondition ? (
            <p>Predicted Weather Condition: <strong>{predictedCondition}</strong></p>
          ) : (
            error.general ? <p className="error">{error.general}</p> : <p className="error">Please check input fields for errors</p>
          )}
          <button onClick={() => setModalIsOpen(false)}>Close</button>
        </Modal>
    </div>
  );
}

export default Weather;
