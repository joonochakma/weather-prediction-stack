import { useState, useEffect } from 'react';
import getTestData from "../../services/test-data";
import Plot from 'react-plotly.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { Modal } from 'react-modal';

function Temperature() {
  const [data, setData] = useState(null);
  const [isScatterOpen, setIsScatterOpen] = useState(false);
  const [isHistogramOpen, setIsHistogramOpen] = useState(false);
  const [plotWidth, setPlotWidth] = useState(window.innerWidth * 0.9);
  const [temperatureMax, setTemperatureMax] = useState('');
  const [temperatureMin, setTemperatureMin] = useState('');
  const [rainSum, setRainSum] = useState('');
  const [humidityMean, setHumidityMean] = useState('');
  const [humidityMax, setHumidityMax] = useState('');
  const [humidityMin, setHumidityMin] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [predictedTemperature, setPredictedTemperature] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/temperature_prediction", {
        temperature_max: parseFloat(temperatureMax),
        temperature_min: parseFloat(temperatureMin),
        rain_sum: parseFloat(rainSum),
        relative_humidity_mean: parseFloat(humidityMean),
        relative_humidity_max: parseFloat(humidityMax),
        relative_humidity_min: parseFloat(humidityMin),
        month: parseInt(month),
        day: parseInt(day),
        hour: parseInt(hour)
      });

      // Log the response to check its structure
      console.log("Response from API:", response.data);

      // Update prediction directly from the response
      setPredictedTemperature(response.data.predicted_temperature);
      setModalIsOpen(true); // Open the modal on success
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
      setPlotWidth(window.innerWidth * 0.9); // Adjust plot width based on window size
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data) {
    return <div>Loading...</div>; // Handle loading state
  }

  if (!data.X_train || !data.y_train || !data.y_pred) {
    return <div>Error: Data not loaded correctly.</div>;
  }

  // Prepare data for scatter matrix plot
  const scatterData = {
    x: data.X_train.map(item => item.TemperatureMax),
    y: data.X_train.map(item => item.TemperatureMin),
    mode: 'markers',
    type: 'scatter',
    name: 'Temperature Data',
    marker: { size: 10 }
  };

  // Prepare data for histogram plot
  const histogramData = [
    {
      x: data.y_train,
      type: 'histogram',
      name: 'Actual Temperature',
      marker: { color: 'blue' },
      opacity: 0.6
    },
    {
      x: data.y_pred,
      type: 'histogram',
      name: 'Predicted Temperature',
      marker: { color: 'red' },
      opacity: 0.6
    }
  ];

  return (
    <div style={{ maxWidth: '100%', padding: '1em', boxSizing: 'border-box' }}>
      <h2 className='model-title'>Temperature Prediction</h2>
      <p className='model-description'>Predict the temperature based on the provided data.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Maximum Temperature (°C): </label>
          <input type="number" value={temperatureMax} onChange={(e) => setTemperatureMax(e.target.value)} required />
        </div>
        <div>
          <label>Minimum Temperature (°C): </label>
          <input type="number" value={temperatureMin} onChange={(e) => setTemperatureMin(e.target.value)} required />
        </div>
        <div>
          <label>Rain Sum (mm): </label>
          <input type="number" value={rainSum} onChange={(e) => setRainSum(e.target.value)} required />
        </div>
        <div>
          <label>Mean Relative Humidity (%): </label>
          <input type="number" value={humidityMean} onChange={(e) => setHumidityMean(e.target.value)} required />
        </div>
        <div>
          <label>Max Relative Humidity (%): </label>
          <input type="number" value={humidityMax} onChange={(e) => setHumidityMax(e.target.value)} required />
        </div>
        <div>
          <label>Min Relative Humidity (%): </label>
          <input type="number" value={humidityMin} onChange={(e) => setHumidityMin(e.target.value)} required />
        </div>
        <div>
          <label>Month: </label>
          <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} required />
        </div>
        <div>
          <label>Day: </label>
          <input type="number" value={day} onChange={(e) => setDay(e.target.value)} required />
        </div>
        <div>
          <label>Hour: </label>
          <input type="number" value={hour} onChange={(e) => setHour(e.target.value)} required />
        </div>
          <button type="submit">Predict</button>
      </form>

      {/* Modal for displaying prediction */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Prediction Result"
      >
        <h2>Prediction Result</h2>
        <p>Predicted Temperature for Next Day: <strong>{predictedTemperature}°C</strong></p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>

      {/* Scatter Plot Accordion */}
      <div 
        onClick={() => setIsScatterOpen(!isScatterOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '1em',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}
      >
        {isScatterOpen ? 'Hide Scatter Plot' : 'Show Scatter Plot for Temperature Features'}
        <ExpandMoreIcon 
          style={{
            marginLeft: 'auto',
            transform: isScatterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      {/* Scatter Plot Content */}
      {isScatterOpen && (
        <div style={{ padding: '1em', border: '1px solid #ccc', borderTop: 'none', overflowX: 'auto' }}>
          <Plot
            data={[scatterData]}
            layout={{
              title: 'Scatter Matrix for Temperature and Related Features',
              xaxis: { title: 'Temperature Max' },
              yaxis: { title: 'Temperature Min' },
              dragmode: 'select',
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
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '1em',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}
      >
        {isHistogramOpen ? 'Hide Histogram' : 'Show Histogram for Actual vs Predicted Temperature'}
        <ExpandMoreIcon 
          style={{
            marginLeft: 'auto',
            transform: isHistogramOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      {/* Histogram Plot Content */}
      {isHistogramOpen && (
        <div style={{ padding: '1em', border: '1px solid #ccc', borderTop: 'none', overflowX: 'auto' }}>
          <Plot
            data={histogramData}
            layout={{
              barmode: 'overlay',
              title: 'Histogram of Actual vs Predicted Temperature',
              xaxis: { title: 'Temperature' },
              yaxis: { title: 'Frequency' },
              width: plotWidth,
              height: plotWidth * 0.5,
              autosize: true,
            }}
          />
        </div>
      )}
    </div>
  );
}

Modal.setAppElement('#root');

export default Temperature;