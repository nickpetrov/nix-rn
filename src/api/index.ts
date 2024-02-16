// utils
import axios from 'axios';
import * as Sentry from '@sentry/react-native';
import {CLIENT_API_BASE_URL} from 'config';
import {getVersion, getBundleId} from 'react-native-device-info';

const apiClient = axios.create({
  baseURL: CLIENT_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': `${getVersion()}`,
    'X-Client-Name': `${getBundleId()}`,
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
    Sentry.captureException(error.response, scope => {
      scope.setTag('nix_api_request', 'error');
      return scope;
    });
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
    if(!(error.config.url === 'search/item' || error.config.url === 'natural/nutrients')) {
      Sentry.captureException(error.response, scope => {
        scope.setTag('nix_api_response', 'error');
        return scope;
      });
    }
    if (error?.response) {
      throw error?.response;
    } else {
      throw new Error(error?.message || 'Wrong response from api');
    }
  },
);

export default apiClient;
