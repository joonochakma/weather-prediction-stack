import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Modal from "react-modal";

// Set the root element for the modal
Modal.setAppElement("#root");

const FeatureImportanceChart = () => {
  const [featureImportance, setFeatureImportance] = useState({});
  const [isChartOpen, setIsChartOpen] = useState(false); // State to toggle chart visibility
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchFeatureImportance = async () => {
      try {
        const response = await axios.get("http://localhost:8000/feature_importance");
        setFeatureImportance(response.data);
      } catch (error) {
        console.error("Error fetching feature importance:", error);
      }
    };

    fetchFeatureImportance();
  }, []);

  const data = [
    {
      x: Object.keys(featureImportance),
      y: Object.values(featureImportance),
      type: "bar",
      marker: { color: "blue" },
      hoverinfo: "x+y", // Show both x and y values on hover
      onClick: (event) => {
        const featureIndex = event.points[0].pointIndex;
        const featureName = Object.keys(featureImportance)[featureIndex];
        const importanceScore = Object.values(featureImportance)[featureIndex];
        setSelectedFeature(featureName);
        setScore(importanceScore);
        setModalIsOpen(true);
      },
    },
  ];

  const layout = {
    title: "Feature Importance",
    xaxis: { title: "" },
    yaxis: { title: "Importance Score" },
    width: 1400, 
    height: 900, 
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFeature(null);
    setScore(null);
  };

  if (Object.keys(featureImportance).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="feature-importance">
      <h2 className="feature-importance-title">Feature Importance Chart</h2>
      <div onClick={() => setIsChartOpen(!isChartOpen)} className="accordion-header">
        {isChartOpen ? "Hide Feature Importance Chart" : "Show Feature Importance Chart"}
        <ExpandMoreIcon className={isChartOpen ? "icon-rotated" : "icon-default"} />
      </div>

      {isChartOpen && (
        <div className="chart-content">
          <Plot data={data} layout={layout} />
        </div>
      )}

      {/* Modal for displaying feature importance details */}
      <Modal
        isOpen={modalIsOpen} // Controlling modal visibility
        onRequestClose={closeModal} // Function to close modal
        contentLabel="Feature Importance Detail" // Accessibility label for modal
        className="prediction-modal" // Styling for modal
        overlayClassName="prediction-modal-overlay" // Styling for modal overlay
      >
        <h2 className="prediction-result">Feature Importance Detail</h2>
        {selectedFeature && (
          <p className="prediction-text">
            Feature: <strong>{selectedFeature}</strong> <br />
            Importance Score: {score !== null ? score.toFixed(2) : "N/A"}
          </p>
        )}
        <button onClick={closeModal} className="close-button">Close</button> {/* Button to close modal */}
      </Modal>
    </div>
  );
};

export default FeatureImportanceChart;