import apiClient from 'api';
import {SignUpRequest} from 'store/auth/auth.types';

const authService = {
  async siginIn(emailOrPhone: string, password: string) {
    return await apiClient.post('auth/signin', {
      email: emailOrPhone.indexOf('@') > -1 ? emailOrPhone : undefined,
      mobile_number: !(emailOrPhone.indexOf('@') > -1)
        ? emailOrPhone
        : undefined,
      password,
    });
  },
  async fbSignIn(access_token: string) {
    return await apiClient.post('oauth/facebook/signin', {
      access_token,
    });
  },
  async appleSignIn(apple_user_data: any) {
    return await apiClient.post('oauth/apple/signin', {
      ...apple_user_data,
    });
  },
  async signUp(data: SignUpRequest) {
    return await apiClient.post('auth/signup', {
      ...data,
    });
  },
  async requestUpdatePassword(email: string) {
    return await apiClient.get('auth/updatePassword', {
      params: {
        email,
      },
    });
  },
  async sendEmailVerification(email: string) {
    return await apiClient.get('auth/email/verify/request', {
      params: {
        email,
      },
    });
  },
};

export default authService;
