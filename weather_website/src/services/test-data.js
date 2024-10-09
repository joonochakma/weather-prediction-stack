import axios from 'axios';

const baseUrl = process.env.SERVER_URL || 'http://127.0.0.1:8000';
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

async function getTestData() {
  try {
    const response = await axiosInstance.get('/testdata');
    return response.data;
  } catch (error) {
    console.error(error);
  }
  
}

export default getTestData;