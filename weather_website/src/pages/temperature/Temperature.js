import { useState, useEffect } from 'react';
import getTestData from "../../services/test-data";
import Plot from 'react-plotly.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Temperature() {
  const [data, setData] = useState(null);
  const [isScatterOpen, setIsScatterOpen] = useState(false);
  const [isHistogramOpen, setIsHistogramOpen] = useState(false);
  const [plotWidth, setPlotWidth] = useState(window.innerWidth * 0.9);

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

export default Temperature;