// utils
import AsyncStorage from '@react-native-async-storage/async-storage';

// api
import authService from 'api/authService';
import apiClient from 'api/index';
import userService from 'api/userService';

//actions
import {clear as clearAutocomplete} from 'store/autoComplete/autoComplete.actions';
import {reset as resetBasket} from 'store/basket/basket.actions';

// types
import {Dispatch} from 'redux';
import {authActionTypes, SignUpRequest, User} from './auth.types';
import {RootState} from '../index';

const saveAuthData = async (userData: User, userJWT: string) => {
  await AsyncStorage.getItem('authData').then(data => {
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
    try {
      const response = await authService.fbSignIn(access_token);

      const userData = response.data;

      await dispatch({type: authActionTypes.SIGNIN, userData});
      saveAuthData(userData.user, userData['x-user-jwt']);
    } catch (err: any) {
      if (err.status === 400 || err.status === 500) {
        throw new Error(err.status.toString());
      }
    }
  };
};

export const appleLogin = (apple_user_data: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await authService.appleSignIn(apple_user_data);

      const userData = response.data;

      await dispatch({type: authActionTypes.SIGNIN, userData});
      await saveAuthData(userData.user, userData['x-user-jwt']);
    } catch (err: any) {
      if (err.status === 400 || err.status === 500) {
        throw new Error(err.status.toString());
      }
    }
  };
};

export const signin = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await authService.siginIn(email, password);

      const userData = response.data;

      await dispatch({type: authActionTypes.SIGNIN, userData});
      await saveAuthData(userData.user, userData['x-user-jwt']);
    } catch (err: any) {
      if (err.status === 400) {
        throw new Error(err.status.toString());
      }
    }
  };
};

export const signup = (data: SignUpRequest) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await authService.signUp(data);

      const userData = response.data;

      await dispatch({type: authActionTypes.SIGNUP, userData});
      await saveAuthData(userData.user, userData['x-user-jwt']);

      return userData;
    } catch (err: any) {
      if (err.status === 400) {
        throw new Error(err.status.toString());
      }
      if (err.status === 409) {
        throw new Error(err.status + ': account already exists');
      }
    }
  };
};

export const updateUserData = (newUserObj: Partial<User>) => {
  const request = {...newUserObj};
  return async (dispatch: Dispatch) => {
    try {
      const response = await userService.updateUserData(request);

      const userData = response.data;
      await dispatch({
        type: authActionTypes.UPDATE_USER_DATA,
        newUserObj: newUserObj,
      });
      await saveAuthData(userData.user, userData['x-user-jwt']);

      return userData;
    } catch (err: any) {
      if (err.status === 400) {
        throw new Error(err.status.toString());
      }
    }
  };
};

export const setUserJwt = (newUserJwt: string) => {
  apiClient.defaults.headers.common['x-user-jwt'] = newUserJwt;
  return {type: authActionTypes.SET_USER_JWT, newJwt: newUserJwt};
};

export const getUserDataFromAPI = () => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const jwt = useState().auth.userJWT;
    const response = await userService.getUserData();

    const result = response.data;
    console.log(result);

    dispatch({type: authActionTypes.UPDATE_USER_DATA, newUserObj: result});
    await saveAuthData(result, jwt);
    return result;
  };
};

export const logout = (dispatch: Dispatch<any>) => {
  removeAuthData();
  dispatch(clearAutocomplete());
  dispatch(resetBasket());
  dispatch({type: authActionTypes.LOGOUT});
};
