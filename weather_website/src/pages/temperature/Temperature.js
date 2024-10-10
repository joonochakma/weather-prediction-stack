import { useState, useEffect } from 'react';
import getTestData from "../../services/test-data";
import Plot from 'react-plotly.js';

function Temperature() {
  const [data, setData] = useState(null);

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
  );
}

export default Temperature;