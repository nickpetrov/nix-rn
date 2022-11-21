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
import {batch} from 'react-redux';
import {resetGroceryAgentMode} from 'store/groceryAgentMode/groceryAgentMode.actions';
import {resetGrocerySetting} from 'store/base/base.actions';

export const fbLogin = (access_token: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await authService.fbSignIn(access_token);

      const userData = response.data;
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNIN, userData});
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
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNIN, userData});
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
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNIN, userData});
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
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNUP, userData});

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

      dispatch({
        type: authActionTypes.UPDATE_USER_DATA,
        newUserObj: userData,
      });

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
  return async (dispatch: Dispatch) => {
    const response = await userService.getUserData();

    const result = response.data;

    dispatch({type: authActionTypes.UPDATE_USER_DATA, newUserObj: result});
    return result;
  };
};

export const logout = () => {
  return async (dispatch: Dispatch<any>) => {
    apiClient.defaults.headers.common['x-user-jwt'] = '';
    batch(() => {
      dispatch(clearAutocomplete());
      dispatch(resetBasket());
      dispatch(resetGroceryAgentMode());
      dispatch(resetGrocerySetting());
      dispatch({type: authActionTypes.LOGOUT});
    });
  };
};
