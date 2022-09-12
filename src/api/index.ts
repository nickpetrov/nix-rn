// utils
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const authData = await AsyncStorage.getItem('authData');
    if (authData) {
      const JWT = JSON.parse(authData)?.JWT;
      if (JWT) {
        config.headers['x-user-jwt'] = JWT;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default apiClient;
