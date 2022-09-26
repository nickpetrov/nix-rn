import apiClient from 'api';

const connectedAppsService = {
  async fitbitSign() {
    return await apiClient.post('oauth/fitbit/sign');
  },
  async fitbitUnlink() {
    return await apiClient.get('oauth/fitbit/unlink');
  },
};

export default connectedAppsService;
