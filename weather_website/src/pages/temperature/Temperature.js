import { useState, useEffect } from 'react';
import getTestData from "../../services/test-data";
import Plot from 'react-plotly.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Temperature() {
  const [data, setData] = useState(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getTestData();
      setData(result);
    };
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>; // Handle loading state
  }

  // Prepare data for scatter matrix
  const scatterData = {
    x: data.X_train.map(item => item.TemperatureMax),
    y: data.X_train.map(item => item.TemperatureMin),
    mode: 'markers',
    type: 'scatter',
    name: 'Temperature Data',
    marker: { size: 10 }
  };

  const plotData = [scatterData];

  return (
    <div>
      {/* Accordion header */}
      <div 
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '1em',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          fontWeight: 'bold'
        }}
      >
        {isAccordionOpen ? 'Hide Chart' : 'Show Chart for Scatter Matrix for Temperature and Related Features'}
        <ExpandMoreIcon 
          style={{
            marginLeft: 'auto',
            transform: isAccordionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      {/* Accordion content */}
      {isAccordionOpen && (
        <div style={{ padding: '1em', border: '1px solid #ccc', borderTop: 'none' }}>
          <Plot
            data={plotData}
            layout={{
              title: 'Scatter Matrix for Temperature and Related Features',
              xaxis: { title: 'Temperature Max' },
              yaxis: { title: 'Temperature Min' },
              dragmode: 'select',
              width: 1000,
              height: 1000,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Temperature;