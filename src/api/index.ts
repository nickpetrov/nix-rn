// utils
import axios from 'axios';
import {CLIENT_API_BASE_URL} from 'config';

const apiClient = axios.create({
  baseURL: CLIENT_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    if (config.headers === undefined) {
      config.headers = {};
    }
    if (__DEV__) console.log('Client API Request:', config);
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  function (response) {
    if (__DEV__) {
      console.log('API Response:', response);
    }
    return response;
  },
  async function (error) {
    if (__DEV__) {
      console.log('API Response error:', error);
    }
    throw error.response;
  },
);

export default apiClient;
