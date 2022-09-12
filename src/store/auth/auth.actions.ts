import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from 'api/authService';
import apiClient from 'api/index';
import userService from 'api/userService';
import {Dispatch} from 'redux';

import {clear as clearAutocomplete} from 'store/autoComplete/autoComplete.actions';
import {reset as resetBasket} from 'store/basket/basket.actions';
import {authActionTypes, SignUpRequest, User} from './auth.types';

const saveAuthData = (userData: User, userJWT: string) => {
  AsyncStorage.getItem('authData').then(data => {
    let prevData = JSON.parse(data || '{}');
    if (!userJWT) {
      userJWT = prevData.JWT || null;
    }
    if (!prevData || !prevData.userData) {
      prevData = {userData: {}};
    }
    AsyncStorage.setItem(
      'authData',
      JSON.stringify({
        userData: {...prevData.userData, ...userData},
        userJWT,
      }),
    );
    if (userJWT && userJWT !== prevData.JWT) {
      apiClient.defaults.headers.common['x-user-jwt'] = userJWT;
    }
  });
};

const removeAuthData = () => {
  AsyncStorage.removeItem('authData');
};

export const fbLogin = (access_token: string) => {
  return async (dispatch: Dispatch) => {
    const response = await authService.fbSignIn(access_token);

    if (response.status === 400 || response.status === 500) {
      throw new Error(response.status.toString());
    }

    const userData = response.data;

    await dispatch({type: authActionTypes.SIGNIN, userData});
    saveAuthData(userData.user, userData['x-user-jwt']);
  };
};

export const appleLogin = (apple_user_data: any) => {
  return async (dispatch: Dispatch) => {
    const response = await authService.appleSignIn(apple_user_data);

    if (response.status === 400 || response.status === 500) {
      throw new Error(response.status.toString());
    }

    const userData = response.data;

    await dispatch({type: authActionTypes.SIGNIN, userData});
    saveAuthData(userData.user, userData['x-user-jwt']);
  };
};

export const signin = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    const response = await authService.siginIn(email, password);

    if (response.status === 400) {
      throw new Error(response.status.toString());
    }

    const userData = response.data;

    await dispatch({type: authActionTypes.SIGNIN, userData});
    saveAuthData(userData.user, userData['x-user-jwt']);
  };
};

export const signup = (data: SignUpRequest) => {
  return async (dispatch: Dispatch) => {
    const response = await authService.signUp(data);

    if (response.status === 400) {
      throw new Error(response.status.toString());
    }
    if (response.status === 409) {
      throw new Error(response.status + ': account already exists');
    }

    const userData = response.data;

    await dispatch({type: authActionTypes.SIGNUP, userData});
    saveAuthData(userData.user, userData['x-user-jwt']);

    return userData;
  };
};

export const updateUserData = (newUserObj: any) => {
  const request = {...newUserObj};
  return async (dispatch: Dispatch) => {
    const response = await userService.updateUserData(request);

    if (response.status === 400) {
      throw new Error(response.status.toString());
    }

    const userData = response.data;
    await dispatch({
      type: authActionTypes.UPDATE_USER_DATA,
      newUserObj: newUserObj,
    });
    saveAuthData(userData.user, userData['x-user-jwt']);

    return userData;
  };
};

export const setUserJwt = (newUserJwt: string) => {
  apiClient.defaults.headers.common['x-user-jwt'] = newUserJwt;
  return {type: authActionTypes.SET_USER_JWT, newJwt: newUserJwt};
};

export const getUserDataFromAPI = () => {
  return async (dispatch: Dispatch, useState: any) => {
    const jwt = useState().auth.userJWT;
    const response = await userService.getUserData();

    const result = response.data;
    console.log(result);

    dispatch({type: authActionTypes.UPDATE_USER_DATA, newUserObj: result});
    saveAuthData(result, jwt);
    return result;
  };
};

export const logout = (dispatch: Dispatch) => {
  removeAuthData();
  dispatch(clearAutocomplete());
  dispatch(resetBasket());
  dispatch({type: authActionTypes.LOGOUT});
};
