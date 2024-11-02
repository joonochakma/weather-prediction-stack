import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Plot from 'react-plotly.js';
import './Heatwave.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Heatwave = () => {
    const [minTemp, setMinTemp] = useState('');
    const [maxTemp, setMaxTemp] = useState('');
    const [date, setDate] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false); 
    const [clusterData, setClusterData] = useState({ x: [], y: [], cluster: [] });
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false); // Single state for toggle

    useEffect(() => {
        fetchClusterVisualization(); // Fetch cluster data on component mount
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        try {
            const response = await fetch(`http://127.0.0.1:8000/heatwave_prediction?date=${date}`, {
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
            setModalIsOpen(true); // Open the modal after setting prediction
        } catch (err) {
            console.error('Error:', err);
            setError('Error fetching prediction. Please try again.');
            setPrediction(null); // Clear previous prediction on error
        }
    };

    const fetchClusterVisualization = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/clusters_visualization');
            console.log('Response status:', response.status); // Log the response status
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Cluster data:', data); // Log the received data
            
            // Update state with received data
            setClusterData(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cluster visualization:", error);
            setLoading(false);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const openDetailsModal = () => {
        setDetailsModalIsOpen(true); // Open details modal
    };

    const closeDetailsModal = () => {
        setDetailsModalIsOpen(false); // Close details modal
    };

    const getClusterColors = (clusters) => {
        return clusters.map(cluster => (cluster === 0 ? 'blue' : 'red')); // Customize colors as needed
    };

    return (
        <div>
            <h2 className="model_title">Heatwave Prediction</h2>
            <p className="model_description">Predict if a heatwave is likely to occur based on minimum and maximum temperature.</p>
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
                            required
                        />
                    </label>
                </div>
                <button className="submit-button" type="submit">Predict</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Prediction Result">
                {prediction && (
                    <div className="result">
                        <h3>Prediction Result</h3>
                        <p>Date: {prediction.date}</p>
                        <p>Minimum Temperature: {prediction.minimum_temperature} °C</p>
                        <p>Maximum Temperature: {prediction.maximum_temperature} °C</p>
                        <p>Predicted Cluster: {prediction.cluster}</p>
                        <p>{prediction.cluster === 1 ? "Heatwave is occurring!" : "No heatwave."}</p>
                        <div className="button-container">
                            <button className="detail-button" onClick={openDetailsModal}>More Details</button>
                        </div>
                    </div>
                )}
                <button onClick={closeModal} style={{ margin: '20px auto', width: 'stretch', display: 'block' }}>Close</button>
            </Modal>

            {/* Nested Modal for More Details */}
            <Modal isOpen={detailsModalIsOpen} onRequestClose={closeDetailsModal} contentLabel="More Details">
                <h3>More About Heatwaves</h3>
                <p>A heatwave is defined as a prolonged period of excessively hot weather, which may be accompanied by high humidity.</p>
                <button onClick={closeDetailsModal}>Close</button>
            </Modal>

            {/* Single Dropdown for Prediction and Cluster Visualization */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '1em',
                    border: '1px solid #ccc',
                    fontWeight: 'bold',
                    marginTop: '20px',
                    backgroundColor: '#ECF6FE',
                    color: '#1870C9'
                }}
            >
                {isOpen ? 'Hide Prediction and Cluster Visualization' : 'Show Prediction and Cluster Visualization'}
                <ExpandMoreIcon 
                    style={{
                        marginLeft: 'auto',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                    }}
                />
            </div>

            {/* Combined Content */}
            {isOpen && (
                <div style={{ marginTop: '20px' }}>
                    {prediction && (
                        <div>
                            <h3>Prediction Result</h3>
                            <p>Date: {prediction.date}</p>
                            <p>Minimum Temperature: {prediction.minimum_temperature} °C</p>
                            <p>Maximum Temperature: {prediction.maximum_temperature} °C</p>
                            <p>Predicted Cluster: {prediction.cluster}</p>
                            <p>{prediction.cluster === 1 ? "Heatwave is occurring!" : "No heatwave."}</p>
                        </div>
                    )}
                    
                    <h3>Cluster Visualization</h3>
                    {clusterData.x.length > 0 && clusterData.y.length > 0 ? (
                        <Plot
                            data={[
                                {
                                    x: clusterData.x,
                                    y: clusterData.y,
                                    mode: 'markers',
                                    type: 'scatter',
                                    marker: {
                                        color: getClusterColors(clusterData.cluster),
                                        size: 10,
                                        opacity: 0.8,
                                    },
                                    text: clusterData.cluster.map(cluster => `Cluster: ${cluster}`),
                                },
                            ]}
                            layout={{
                                width: 800,
                                height: 400,
                                title: 'Clusters of Temperature Data',
                                xaxis: { title: 'PCA 1' },
                                yaxis: { title: 'PCA 2' },
                            }}
                        />
                    ) : (
                        <p>No cluster data available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

Modal.setAppElement('#root'); // Set the root element for accessibility

export default Heatwave; // Ensure this line is present