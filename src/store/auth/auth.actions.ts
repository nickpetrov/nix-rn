// api
import authService from 'api/authService';
import apiClient from 'api/index';
import userService from 'api/userService';
import {batch} from 'react-redux';

//actions
import {clear as clearAutocomplete} from 'store/autoComplete/autoComplete.actions';
import {clearBasket} from 'store/basket/basket.actions';
import {resetGroceryAgentMode} from 'store/groceryAgentMode/groceryAgentMode.actions';
import {
  resetGrocerySetting,
  updateSentryContext,
} from 'store/base/base.actions';

// types
import {Dispatch} from 'redux';
import {
  authAction,
  authActionTypes,
  logoutAction,
  SignUpRequest,
  updateUserAction,
  User,
} from './auth.types';
import {AppleRequestResponse} from '@invertase/react-native-apple-authentication';
import {autocompleteClearAction} from 'store/autoComplete/autoComplete.types';
import {resetGrocerySettingsAction} from 'store/base/base.types';
import {resetBasketAction} from 'store/basket/basket.types';
import {clearGroceryAgentModeAction} from 'store/groceryAgentMode/groceryAgentMode.types';
import {RootState} from '../index';

export const fbLogin = (access_token: string) => {
  return async (dispatch: Dispatch<authAction>) => {
    try {
      const response = await authService.fbSignIn(access_token);

      const userData = response.data;
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNIN, userData});
      updateSentryContext(userData.user, userData['x-user-jwt']);
    } catch (err: any) {
      if (err.status === 400 || err.status === 500) {
        throw new Error(err.status.toString());
      }
    }
  };
};

export const appleLogin = (apple_user_data: AppleRequestResponse) => {
  return async (dispatch: Dispatch<authAction>) => {
    try {
      const response = await authService.appleSignIn(apple_user_data);
      const userData = response.data;
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNIN, userData});
      updateSentryContext(userData.user, userData['x-user-jwt']);
    } catch (err: any) {
      throw err;
    }
  };
};

export const signin = (email: string, password: string) => {
  return async (dispatch: Dispatch<authAction>) => {
    try {
      const response = await authService.siginIn(email, password);

      const userData = response.data;
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNIN, userData});
      updateSentryContext(userData.user, userData['x-user-jwt']);
    } catch (err: any) {
      if (err.status === 400) {
        throw new Error(err.status.toString());
      }
    }
  };
};

export const signup = (data: SignUpRequest) => {
  return async (dispatch: Dispatch<authAction>) => {
    try {
      const response = await authService.signUp(data);

      const userData = response.data;
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNUP, userData});
      updateSentryContext(userData.user, userData['x-user-jwt']);
      return userData;
    } catch (err: any) {
      throw err;
    }
  };
};

export const updateUserData = (newUserObj: Partial<User>) => {
  const request = {...newUserObj};
  return async (dispatch: Dispatch<updateUserAction>) => {
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
  return async (
    dispatch: Dispatch<updateUserAction>,
    useState: () => RootState,
  ) => {
    const userJWT = useState().auth.userJWT;
    try {
      const response = await userService.getUserData();

      const result = response.data;

      dispatch({type: authActionTypes.UPDATE_USER_DATA, newUserObj: result});
      updateSentryContext(result, userJWT);
      return result;
    } catch (error) {
      console.log(error);
    }
  };
};

export const logout = () => {
  return async (
    dispatch: Dispatch<
      | logoutAction
      | autocompleteClearAction
      | resetGrocerySettingsAction
      | resetBasketAction
      | clearGroceryAgentModeAction
    >,
  ) => {
    apiClient.defaults.headers.common['x-user-jwt'] = '';
    batch(() => {
      dispatch(clearAutocomplete());
      dispatch(clearBasket());
      dispatch(resetGroceryAgentMode());
      dispatch(resetGrocerySetting());
      dispatch({type: authActionTypes.LOGOUT});
    });
  };
};
