import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from 'redux';

import {clear as clearAutocomplete} from 'store/autoComplete/autoComplete.actions';
import {reset as resetBasket} from 'store/basket/basket.actions';
import {SignUpRequest, User} from './auth.types';

export const SIGNIN = 'SIGNIN';
export const SIGNUP = 'SIGNUP';
export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
export const SET_USER_JWT = 'SET_USER_JWT';
export const LOGOUT = 'LOGOUT';
export const FB_LOGIN = 'FB_LOGIN';
export const APPLE_LOGIN = 'APPLE_LOGIN';

export const fbLogin = (access_token: string) => {
  return async (dispatch: Dispatch) => {
    const response = await fetch(
      'https://trackapi.nutritionix.com/v2/oauth/facebook/signin',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({access_token}),
      },
    );

    if (response.status === 400 || response.status === 500) {
      throw new Error(response.status.toString());
    }

    const userData = await response.json();

    await dispatch({type: SIGNIN, userData});
    saveAuthData(userData.user, userData['x-user-jwt']);
  };
};

export const appleLogin = (apple_user_data: any) => {
  return async (dispatch: Dispatch) => {
    const response = await fetch(
      'https://trackapi.nutritionix.com/v2/oauth/apple/signin',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...apple_user_data}),
      },
    );

    if (response.status === 400 || response.status === 500) {
      throw new Error(response.status.toString());
    }

    const userData = await response.json();

    await dispatch({type: SIGNIN, userData});
    saveAuthData(userData.user, userData['x-user-jwt']);
  };
};

export const signin = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    const response = await fetch(
      'https://trackapi.nutritionix.com/v2/auth/signin',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      },
    );

    if (response.status === 400) {
      throw new Error(response.status.toString());
    }

    const userData = await response.json();

    await dispatch({type: SIGNIN, userData});
    saveAuthData(userData.user, userData['x-user-jwt']);
  };
};

export const signup = (data: SignUpRequest) => {
  return async (dispatch: Dispatch) => {
    const response = await fetch(
      'https://trackapi.nutritionix.com/v2/auth/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...data}),
      },
    );

    if (response.status === 400) {
      throw new Error(response.status.toString());
    }
    if (response.status === 409) {
      throw new Error(response.status + ': account already exists');
    }

    const userData = await response.json();

    await dispatch({type: SIGNUP, userData});
    saveAuthData(userData.user, userData['x-user-jwt']);
    return userData;
  };
};

export const updateUserData = (newUserObj: any) => {
  const request = {...newUserObj};
  return async (dispatch: Dispatch, useState: any) => {
    const jwt = useState().user.userJWT;
    const response = await fetch(
      'https://trackapi.nutritionix.com/v2/me/preferences',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-jwt': jwt,
        },
        body: JSON.stringify({...request}),
      },
    );

    if (response.status === 400) {
      throw new Error(response.status.toString());
    }

    const userData = await response.json();
    await dispatch({type: UPDATE_USER_DATA, newUserObj: newUserObj});
    saveAuthData(userData.user, userData['x-user-jwt']);
    return userData;
  };
};

export const setUserJwt = (newUserJwt: string) => {
  return {type: SET_USER_JWT, newJwt: newUserJwt};
};

export const getUserDataFromAPI = () => {
  return async (dispatch: Dispatch, useState: any) => {
    const jwt = useState().user.userJWT;
    const response = await fetch('https://trackapi.nutritionix.com/v2/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-jwt': jwt,
      },
    });

    const result = await response.json();
    console.log(result);

    dispatch({type: UPDATE_USER_DATA, newUserObj: result});
    saveAuthData(result, jwt);
    return result;
  };
};

export const logout = (dispatch: Dispatch) => {
  removeAuthData();
  dispatch(clearAutocomplete());
  dispatch(resetBasket());
  dispatch({type: LOGOUT});
};

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
  });
};

const removeAuthData = () => {
  AsyncStorage.removeItem('authData');
};
