//utils
import {captureException} from '@sentry/react-native';
import {batch} from 'react-redux';
import moment from 'moment-timezone';

// api
import authService from 'api/authService';
import apiClient from 'api/index';
import userService from 'api/userService';

//actions
import {clear as clearAutocomplete} from 'store/autoComplete/autoComplete.actions';
import {clearBasket} from 'store/basket/basket.actions';
import {resetGroceryAgentMode} from 'store/groceryAgentMode/groceryAgentMode.actions';
import {
  resetGrocerySetting,
  updateSentryContext,
} from 'store/base/base.actions';
import {resetWalkthrogh} from 'store/walkthrough/walkthrough.actions';
import {clearCustomFoods} from 'store/customFoods/customFoods.actions';

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
import {clearWalkthroghAction} from 'store/walkthrough/walkthrough.types';
import {clearCustomFoodsAction} from 'store/customFoods/customFoods.types';

export const testLogin = (jwt_token: string) => {
  return async (dispatch: Dispatch<authAction>, useState: () => RootState) => {
    try {
      const timezone = moment.tz.guess(true) || 'US/Eastern';
      const defualtUser = useState().auth.userData;
      const userData = {
        user: {
          ...defualtUser,
          timezone,
        },
        'x-user-jwt': jwt_token,
      };
      apiClient.defaults.headers.common['x-user-jwt'] = jwt_token;
      dispatch({type: authActionTypes.SIGNIN, userData});
      updateSentryContext(userData.user, jwt_token);
    } catch (err: any) {
      console.log('error test login by jwt', err);
      captureException(err);
    }
  };
};

export const fbLogin = (access_token: string) => {
  return async (dispatch: Dispatch<authAction>) => {
    try {
      const timezone = moment.tz.guess(true) || 'US/Eastern';
      const response = await authService.fbSignIn(access_token, timezone);

      const userData = response.data;
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNIN, userData});
      updateSentryContext(userData.user, userData['x-user-jwt']);
    } catch (err: any) {
      captureException(err);
      if (err.status === 400 || err.status === 500) {
        throw new Error(err.status.toString());
      }
    }
  };
};

export const appleLogin = (apple_user_data: AppleRequestResponse) => {
  return async (dispatch: Dispatch<authAction>) => {
    try {
      const timezone = moment.tz.guess(true) || 'US/Eastern';
      const response = await authService.appleSignIn(apple_user_data, timezone);
      const userData = response.data;
      apiClient.defaults.headers.common['x-user-jwt'] = userData['x-user-jwt'];
      dispatch({type: authActionTypes.SIGNIN, userData});
      updateSentryContext(userData.user, userData['x-user-jwt']);
    } catch (err: any) {
      captureException(err);
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
      captureException(err);
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
      captureException(err);
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
      captureException(err);
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
      captureException(error);
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
      | clearWalkthroghAction
      | clearCustomFoodsAction
    >,
  ) => {
    apiClient.defaults.headers.common['x-user-jwt'] = '';
    batch(() => {
      dispatch(clearAutocomplete());
      dispatch(clearBasket());
      dispatch(resetWalkthrogh());
      dispatch(resetGroceryAgentMode());
      dispatch(resetGrocerySetting());
      dispatch(clearCustomFoods());
      dispatch({type: authActionTypes.LOGOUT});
    });
  };
};
