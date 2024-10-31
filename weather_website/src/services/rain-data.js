import axios from 'axios';

// Define the base URL, which can be configured through an environment variable
const baseUrl = process.env.SERVER_URL || 'http://127.0.0.1:8000';
const axiosInstance = axios.create({
  baseURL: baseUrl,
});


async function predictRain(maxTemp, minTemp, rainfall) {
  try {
    const response = await axiosInstance.post('/predict_rain', {
      max_temp: maxTemp,
      min_temp: minTemp,
      rainfall: rainfall,
    });
    return response.data;
  } catch (error) {
    console.error("Error predicting rain:", error);
    return { error: "Failed to get rain prediction" };
  }
}

export default predictRain;