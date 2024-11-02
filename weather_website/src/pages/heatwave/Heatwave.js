import React, { useState } from 'react';
import Modal from 'react-modal';
import './Heatwave.css';
import { alignProperty } from '@mui/material/styles/cssUtils';

const Heatwave = () => {
    const [minTemp, setMinTemp] = useState('');
    const [maxTemp, setMaxTemp] = useState('');
    const [date, setDate] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false); 

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        try {
            const response = await fetch('http://127.0.0.1:8000/heatwave_prediction?date=' + date, {
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

    const closeModal = () => {
        setModalIsOpen(false);
    }

    const openDetailsModal = () => {
      setDetailsModalIsOpen(true); // Open details modal
    };

    const closeDetailsModal = () => {
      setDetailsModalIsOpen(false); // Close details modal
    };

    return (
        <div>
            <h2 className="model_title">Heatwave Prediction</h2>
            <p className="model_description">Predict if a heatwave is likely to occur in Melbourne based on the minimum and maximum temperature.</p>
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
                        <p>{prediction.predicted_cluster === 1 ? "Heatwave is occurring!" : "No heatwave."}</p>
                        <div className="button-container">
                            <button className="detail-button" onClick={openDetailsModal}>More Details</button>
                        </div>
                    </div>
                )}
                <button onClick={closeModal} style={{margin:'20px auto', width: 'stretch', display: 'block'}}>Close</button>
            </Modal>

            {/* Nested Modal for More Details */}
            <Modal isOpen={detailsModalIsOpen} onRequestClose={closeDetailsModal} contentLabel="More Details">
                <h3>More About Heatwaves</h3>
                <p>A heatwave is defined as a prolonged period of excessively hot weather, which may be accompanied by high humidity.</p>
                <button onClick={closeDetailsModal}>Close</button>
            </Modal>
        </div>
    );
};

Modal.setAppElement('#root'); // Set the root element for accessibility

export default Heatwave;