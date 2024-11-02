import { useState, useEffect } from "react";
import getTestData from "../../services/test-data";
import Plot from "react-plotly.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import Modal from "react-modal";
import "./Temperature.css";

function Temperature() {
  const [data, setData] = useState(null);
  const [isScatterOpen, setIsScatterOpen] = useState(false);
  const [isHistogramOpen, setIsHistogramOpen] = useState(false);
  const [plotWidth, setPlotWidth] = useState(window.innerWidth * 0.9);
  const [temperatureMax, setTemperatureMax] = useState("");
  const [temperatureMin, setTemperatureMin] = useState("");
  const [rainSum, setRainSum] = useState("");
  const [humidityMean, setHumidityMean] = useState("");
  const [humidityMax, setHumidityMax] = useState("");
  const [humidityMin, setHumidityMin] = useState("");
  const [predictedTemperature, setPredictedTemperature] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Input validation
  const ValidateInputs = () => {
    const errors = {};

    if (
      temperatureMax === "" ||
      isNaN(temperatureMax) ||
      temperatureMax < -50 ||
      temperatureMax > 60
    ) {
      errors.temperatureMax =
        "Maximum temperature must be a number between -50 and 60.";
    }
    if (
      temperatureMin === "" ||
      isNaN(temperatureMin) ||
      temperatureMin < -50 ||
      temperatureMin > 60
    ) {
      errors.temperatureMin =
        "Minimum temperature must be a number between -50 and 60.";
    }
    if (parseFloat(temperatureMax) < parseFloat(temperatureMin)) {
      errors.temperatureMin =
        "Minimum temperature must be less than maximum temperature.";
      errors.temperatureMax =
        "Maximum temperature must be greater than minimum temperature.";
    }
    if (rainSum === "" || isNaN(rainSum) || rainSum < 0) {
      errors.rainSum = "Rain sum must be a positive number.";
    }
    if (
      humidityMean === "" ||
      isNaN(humidityMean) ||
      humidityMean < 0 ||
      humidityMean > 100
    ) {
      errors.humidityMean =
        "Mean relative humidity must be a number between 0 and 100.";
    }
    if (
      humidityMax === "" ||
      isNaN(humidityMax) ||
      humidityMax < 0 ||
      humidityMax > 100
    ) {
      errors.humidityMax =
        "Maximum relative humidity must be a number between 0 and 100.";
    }
    if (
      humidityMin === "" ||
      isNaN(humidityMin) ||
      humidityMin < 0 ||
      humidityMin > 100
    ) {
      errors.humidityMin =
        "Minimum relative humidity must be a number between 0 and 100.";
    }
    if (parseFloat(humidityMax) < parseFloat(humidityMin)) {
      errors.humidityMin =
        "Minimum relative humidity must be less than maximum relative humidity.";
      errors.humidityMax =
        "Maximum relative humidity must be greater than minimum relative humidity.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission and fetch prediction
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ValidateInputs()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/temperature_prediction",
        {
          temperature_max: parseFloat(temperatureMax),
          temperature_min: parseFloat(temperatureMin),
          rain_sum: parseFloat(rainSum),
          relative_humidity_mean: parseFloat(humidityMean),
          relative_humidity_max: parseFloat(humidityMax),
          relative_humidity_min: parseFloat(humidityMin),
        }
      );

      console.log("Response from API:", response.data);
      setPredictedTemperature(response.data.predicted_temperature);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPredictedTemperature("Error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getTestData();
      setData(result);
    };
    fetchData();

    const handleResize = () => {
      setPlotWidth(window.innerWidth * 0.9);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  if (!data.X_train || !data.y_train || !data.y_pred) {
    return <div>Error: Data not loaded correctly.</div>;
  }

  // Prepare data for scatter matrix plot
  const scatterData = {
    x: data.X_train.map((item) => item.TemperatureMax),
    y: data.X_train.map((item) => item.TemperatureMin),
    mode: "markers",
    type: "scatter",
    name: "Temperature Data",
    marker: { size: 10 },
  };

  // Prepare data for histogram plot
  const histogramData = [
    {
      x: data.y_train,
      type: "histogram",
      name: "Actual Temperature",
      marker: { color: "blue" },
      opacity: 0.6,
    },
    {
      x: data.y_pred,
      type: "histogram",
      name: "Predicted Temperature",
      marker: { color: "red" },
      opacity: 0.6,
    },
  ];

  return (
    <div className="temperature-form">
      <h2 className="temperature-title">Temperature Prediction Model</h2>

      {/* Description Section */}
      <section className="description-section">
        <h2 className="temperature-section-title">Description</h2>
        <p className="temperature-description">
          Welcome to our Temperature Prediction Model! Our platform uses
          advanced machine learning algorithms, specifically a linear regression
          model, to forecast temperature trends accurately. Designed for both
          researchers and weather enthusiasts, our tool leverages historical
          data to predict future temperatures. Whether you’re tracking climate
          patterns or planning for weather-dependent projects, our user-friendly
          interface and precise predictions can provide insights to help you
          stay prepared.
        </p>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <h2 className="temperature-section-title">Charts</h2>
        {/* Scatter Plot Accordion */}
        <div
          onClick={() => setIsScatterOpen(!isScatterOpen)}
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
          }}
        >
          {isScatterOpen
            ? "Hide Scatter Plot"
            : "Show Scatter Plot for Temperature Features"}
          <ExpandMoreIcon
            style={{
              marginLeft: "auto",
              transform: isScatterOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>

        {/* Scatter Plot Content */}
        {isScatterOpen && (
          <div
            style={{
              padding: "1em",
              border: "1px solid #ccc",
              borderTop: "none",
              overflowX: "auto",
            }}
          >
            <Plot
              data={[scatterData]}
              layout={{
                title: "Scatter Matrix for Temperature and Related Features",
                xaxis: { title: "Temperature Max" },
                yaxis: { title: "Temperature Min" },
                dragmode: "select",
                width: plotWidth,
                height: plotWidth * 0.5,
                autosize: true,
              }}
            />
          </div>
        )}

        {/* Histogram Plot Accordion */}
        <div
          onClick={() => setIsHistogramOpen(!isHistogramOpen)}
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
          }}
        >
          {isHistogramOpen
            ? "Hide Histogram"
            : "Show Histogram for Actual vs Predicted Temperature"}
          <ExpandMoreIcon
            style={{
              marginLeft: "auto",
              transform: isHistogramOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>

        {/* Histogram Plot Content */}
        {isHistogramOpen && (
          <div
            style={{
              padding: "1em",
              border: "1px solid #ccc",
              borderTop: "none",
              overflowX: "auto",
            }}
          >
            <Plot
              data={histogramData}
              layout={{
                barmode: "overlay",
                title: "Histogram of Actual vs Predicted Temperature",
                xaxis: { title: "Temperature" },
                yaxis: { title: "Frequency" },
                width: plotWidth,
                height: plotWidth * 0.5,
                autosize: true,
              }}
            />
          </div>
        )}
      </section>

      {/* Prediction Model Section */}
      <section className="prediction-model">
        <h2 className="temperature-section-title">Prediction Model</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Maximum Temperature (°C): </label>
            <input
              type="number"
              value={temperatureMax}
              onChange={(e) => setTemperatureMax(e.target.value)}
              required
            />
            {errors.temperatureMax && (
              <p className="error-message">{errors.temperatureMax}</p>
            )}
          </div>
          <div>
            <label>Minimum Temperature (°C): </label>
            <input
              type="number"
              value={temperatureMin}
              onChange={(e) => setTemperatureMin(e.target.value)}
              required
            />
            {errors.temperatureMin && (
              <p className="error-message">{errors.temperatureMin}</p>
            )}
          </div>
          <div>
            <label>Rain Sum (mm): </label>
            <input
              type="number"
              value={rainSum}
              onChange={(e) => setRainSum(e.target.value)}
              required
            />
            {errors.rainSum && (
              <p className="error-message">{errors.rainSum}</p>
            )}
          </div>
          <div>
            <label>Mean Relative Humidity (%): </label>
            <input
              type="number"
              value={humidityMean}
              onChange={(e) => setHumidityMean(e.target.value)}
              required
            />
            {errors.humidityMean && (
              <p className="error-message">{errors.humidityMean}</p>
            )}
          </div>
          <div>
            <label>Max Relative Humidity (%): </label>
            <input
              type="number"
              value={humidityMax}
              onChange={(e) => setHumidityMax(e.target.value)}
              required
            />
            {errors.humidityMax && (
              <p className="error-message">{errors.humidityMax}</p>
            )}
          </div>
          <div>
            <label>Min Relative Humidity (%): </label>
            <input
              type="number"
              value={humidityMin}
              onChange={(e) => setHumidityMin(e.target.value)}
              required
            />
            {errors.humidityMin && (
              <p className="error-message">{errors.humidityMin}</p>
            )}
          </div>
          <button type="submit" className="submit-button">
            Predict
          </button>
        </form>
      </section>

      {/* Modal for displaying prediction */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Prediction Result"
        className="result"
      >
        <div className="result">
          <h2>Prediction Result</h2>
          <p>
            Predicted Temperature for Next Day:{" "}
            <strong>{Math.round(predictedTemperature)}°C</strong>
          </p>
          <button
            className="close-button"
            onClick={() => setModalIsOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Temperature;
