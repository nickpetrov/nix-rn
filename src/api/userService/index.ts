import apiClient from 'api';

const userService = {
  async getUserData() {
    return await apiClient.get('me');
  },
  async updateUserData(data: any) {
    return await apiClient.put('me/preferences', {
      data,
    });
  },
};

export default userService;
