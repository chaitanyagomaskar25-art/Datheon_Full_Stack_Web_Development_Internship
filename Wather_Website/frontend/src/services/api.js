import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to SkyCast API.';

    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

// --- Weather Endpoints ---
export async function getWeatherByCity(city, signal) {
  const response = await apiClient.get('/weather', {
    params: { city: city.trim() },
    signal,
  });
  return response.data.data;
}

export async function getWeatherByCoords(lat, lon, signal) {
  const response = await apiClient.get('/weather', {
    params: { lat, lon },
    signal,
  });
  return response.data.data;
}

// --- Health Status Endpoint ---
export async function getHealthStatus() {
  const response = await apiClient.get('/health');
  return response.data;
}

export default apiClient;
