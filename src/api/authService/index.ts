import apiClient from 'api';
import {SignUpRequest} from 'store/auth/auth.types';

const authService = {
  async siginIn(email: string, password: string) {
    return await apiClient.post('auth/signin', {
      email,
      password,
    });
  },
  async fbSignIn(access_token: string) {
    return await apiClient.post('oauth/facebook/signin', {
      access_token,
    });
  },
  async appleSignIn(apple_user_data: string) {
    return await apiClient.post('oauth/apple/signin', {
      apple_user_data,
    });
  },
  async signUp(data: SignUpRequest) {
    return await apiClient.post('auth/signup', {
      ...data,
    });
  },
  requestUpdatePassword(email: string) {
    return apiClient.get('auth/updatePassword', {
      params: {
        email,
      },
    });
  },
};

export default authService;
