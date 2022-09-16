import apiClient from 'api';
import {User} from 'store/auth/auth.types';

const userService = {
  async getUserData() {
    return await apiClient.get<User>('me');
  },
  async updateUserData(data: User) {
    return await apiClient.put('me/preferences', {
      data,
    });
  },
};

export default userService;
