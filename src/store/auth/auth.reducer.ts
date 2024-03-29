// utils
import moment from 'moment-timezone';
import _ from 'lodash';

//types
import {AuthActions, authActionTypes, UserData} from './auth.types';
import {userLogActionTypes} from 'store/userLog/userLog.types';

export type AuthState = UserData;

const initialState: AuthState = {
  userJWT: '',
  userData: {
    id: '',
    first_name: '',
    last_name: '',
    daily_kcal: 0,
    daily_carbs_pct: 0,
    daily_fat_pct: 0,
    daily_protein_pct: 0,
    username: null,
    ref: null,
    birth_year: 0,
    gender: '',
    email: '',
    oauths: [],
    coach: {is_active: 0, code: ''},
    mobile_number: null,
    enable_weekday_sms: 0,
    enable_review_foods: null,
    is_activated: 0,
    created_at: '',
    timezone: moment.tz.guess(true) || 'US/Central',
    account_setup: '',
    default_nutrient: 208,
    default_nutrient_value: 0,
    grocery_agent: 0,
    height_cm: 0,
    weight_kg: 0,
    country_code: null,
    measure_system: 0,
    exercise_level: 0,
    show_meal_type: 0,
    nutrPrefs: [{nutr_id: 208, goal: 0}],
    push_enabled: 0,
    weekday_reminders_enabled: 0,
    weekend_reminders_enabled: 0,
    premium_user: 0,
    nutrition_topics: [],
    remote_ids: {},
  },
};

export default (
  state: AuthState = initialState,
  action: AuthActions,
): AuthState => {
  switch (action.type) {
    case authActionTypes.UPDATE_USER_DATA: {
      const oldUser = _.cloneDeep(state.userData);
      const stateWithNewUserData = {
        ...state,
        userData: _.merge(oldUser, action.newUserObj),
      };
      return stateWithNewUserData;
    }
    case userLogActionTypes.ADD_WEIGHT_LOG: {
      const oldUser = _.cloneDeep(state.userData);
      const needUpdate =
        moment(action.weights[0].timestamp).format('YYYY-MM-DD') ===
        moment().format('YYYY-MM-DD');
      const stateWithNewUserData = {
        ...state,
        userData: needUpdate
          ? _.merge(oldUser, {weight_kg: action.weights[0].kg})
          : oldUser,
      };
      return stateWithNewUserData;
    }
    case authActionTypes.SIGNIN:
      const stateWithSignedInUser = {
        ...state,
        userJWT: action.userData['x-user-jwt'],
        userData: action.userData.user,
      };
      return stateWithSignedInUser;
    case authActionTypes.SIGNUP:
      const stateWithNewUser = {
        ...state,
        userData: action.userData.user,
        userJWT: action.userData['x-user-jwt'],
      };
      return stateWithNewUser;
    case authActionTypes.FB_LOGIN:
      const stateWithFacebookUser = {
        ...state,
        userJWT: action.userData['x-user-jwt'],
        userData: action.userData.user,
      };
      return stateWithFacebookUser;
    case authActionTypes.APPLE_LOGIN:
      const stateWithAppleUser = {
        ...state,
        userJWT: action.userData['x-user-jwt'],
        userData: action.userData.user,
      };
      return stateWithAppleUser;
    case authActionTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
};
