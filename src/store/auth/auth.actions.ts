// api
import authService from 'api/authService';
import apiClient from 'api/index';
import userService from 'api/userService';

//actions
import {clear as clearAutocomplete} from 'store/autoComplete/autoComplete.actions';
import {reset as resetBasket} from 'store/basket/basket.actions';

// types
import {Dispatch} from 'redux';
import {
  authActionType,
  authActionTypes,
  logoutActionType,
  SignUpRequest,
  updateUserActionType,
  User,
} from './auth.types';
import {batch} from 'react-redux';
import {resetGroceryAgentMode} from 'store/groceryAgentMode/groceryAgentMode.actions';
import {resetGrocerySetting} from 'store/base/base.actions';
import {AppleRequestResponse} from '@invertase/react-native-apple-authentication';

export const fbLogin = (access_token: string) => {
  return async (dispatch: Dispatch<authActionType>) => {
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

export const appleLogin = (apple_user_data: AppleRequestResponse) => {
  return async (dispatch: Dispatch<authActionType>) => {
    try {
      const response = await authService.appleSignIn(apple_user_data);
      const userData = response.data;
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNIN, userData});
    } catch (err: any) {
      throw err;
    }
  };
};

export const signin = (email: string, password: string) => {
  return async (dispatch: Dispatch<authActionType>) => {
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
  return async (dispatch: Dispatch<authActionType>) => {
    try {
      const response = await authService.signUp(data);

      const userData = response.data;
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNUP, userData});

      return userData;
    } catch (err: any) {
      throw err;
    }
  };
};

export const updateUserData = (newUserObj: Partial<User>) => {
  const request = {...newUserObj};
  return async (dispatch: Dispatch<updateUserActionType>) => {
    try {
      const response = await userService.updateUserData(request);

      const userData = response.data;

      dispatch({
        type: authActionTypes.UPDATE_USER_DATA,
        newUserObj: newUserObj,
      });

      return userData;
    } catch (err: any) {
      if (err.status === 400) {
        throw new Error(err.status.toString());
      }
    }
  };
};

export const getUserDataFromAPI = () => {
  return async (dispatch: Dispatch<updateUserActionType>) => {
    const response = await userService.getUserData();

    const result = response.data;

    dispatch({type: authActionTypes.UPDATE_USER_DATA, newUserObj: result});
    return result;
  };
};

export const logout = () => {
  return async (dispatch: Dispatch<logoutActionType | any>) => {
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
