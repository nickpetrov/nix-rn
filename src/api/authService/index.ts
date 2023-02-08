import {AppleRequestResponse} from '@invertase/react-native-apple-authentication';
import apiClient from 'api';
import {AuthResponse, SignUpRequest} from 'store/auth/auth.types';

const authService = {
  async siginIn(emailOrPhone: string, password: string) {
    return await apiClient.post<AuthResponse>('auth/signin', {
      email: emailOrPhone.indexOf('@') > -1 ? emailOrPhone : undefined,
      mobile_number: !(emailOrPhone.indexOf('@') > -1)
        ? emailOrPhone
        : undefined,
      password,
    });
  },
  async fbSignIn(access_token: string, timezone: string) {
    return await apiClient.post<AuthResponse>('oauth/facebook/signin', {
      access_token,
      timezone,
    });
  },
  async appleSignIn(apple_user_data: AppleRequestResponse, timezone: string) {
    return await apiClient.post<AuthResponse>('oauth/apple/signin', {
      ...apple_user_data,
      timezone,
    });
  },
  async signUp(data: SignUpRequest) {
    return await apiClient.post<AuthResponse>('auth/signup', {
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
