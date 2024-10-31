import React, { useState } from 'react';

const Heatwave = () => {
    const [minTemp, setMinTemp] = useState('');
    const [maxTemp, setMaxTemp] = useState('');
    const [date, setDate] = useState(''); // New state for date input
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        try {
          const response = await fetch('http://127.0.0.1:8000/predict_heatwave?date=' + date, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    min_temp: parseFloat(minTemp),
                    max_temp: parseFloat(maxTemp),
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setPrediction(data); // Set the entire prediction object
            setError(''); // Clear any previous errors
        } catch (err) {
            console.error('Error:', err);
            setError('Error fetching prediction. Please try again.');
            setPrediction(null); // Clear previous prediction on error
        }
    };

    return (
        <div>
            <h2>Heatwave Prediction</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Minimum Temperature (°C):
                        <input
                            type="number"
                            value={minTemp}
                            onChange={(e) => setMinTemp(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Maximum Temperature (°C):
                        <input
                            type="number"
                            value={maxTemp}
                            onChange={(e) => setMaxTemp(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Date (YYYY-MM-DD):
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>
                </div>
                <button type="submit">Predict Heatwave</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {prediction && (
                <div>
                    <h3>Prediction Result</h3>
                    <p>Date: {prediction.date}</p>
                    <p>Minimum Temperature: {prediction.minimum_temperature} °C</p>
                    <p>Maximum Temperature: {prediction.maximum_temperature} °C</p>
                    <p>Predicted Cluster: {prediction.predicted_cluster}</p>
                    <p>{prediction.predicted_cluster === 1 ? "Heatwave is occurring!" : "No heatwave."}</p>
                </div>
            )}
        </div>
    );
};

export default Heatwave;