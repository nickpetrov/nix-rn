// utils
import {Platform} from 'react-native';
import {
  getModel,
  getVersion,
  getManufacturer,
  getReadableVersion,
} from 'react-native-device-info';

//types
import {AnyAction} from 'redux';
import {baseActionTypes, BaseState} from './base.types';

let manufacturer = '';
getManufacturer().then(m => {
  manufacturer = m;
});

const initialState: BaseState = {
  agreedToUsePhoto: false,
  agreementPopup: false,
  deviceInfo: {
    version: getVersion(),
    model: getModel(),
    platform: Platform.OS,
    manufacturer: manufacturer,
    appVersion: getReadableVersion(),
  },
  infoMessage: null,
  askForReview: false,
  reviewCheck: {
    rateClicked: null,
    scheduleDate: null,
    lastRunDate: null,
    runCounter: 0,
    popupShown: 0,
  },
  groceryAgentPreferences: {
    volunteer: false,
  },
};

export default (
  state: BaseState = initialState,
  action: AnyAction,
): BaseState => {
  switch (action.type) {
    case baseActionTypes.SET_USER_AGREED_TO_USE_PHOTO:
      const stateWithNewUserData = {
        ...state,
        agreedToUsePhoto: action.payload,
      };
      return stateWithNewUserData;
    case baseActionTypes.DISPLAY_AGREEMENT_POPUP:
      return {...state, agreementPopup: !state.agreementPopup};
    case baseActionTypes.SET_INFO_MESSAGE:
      return {...state, infoMessage: action.payload};
    case baseActionTypes.TOGGLE_ASK_FOR_REVIEW:
      return {...state, askForReview: action.payload};
    case baseActionTypes.MERGE_REVIEW_CHECK: {
      const newReviewCheck = {...state.reviewCheck, ...action.payload};
      return {...state, reviewCheck: newReviewCheck};
    }
    case baseActionTypes.TOGGLE_GROCERY_AGENT_PREFERENCES:
      return {
        ...state,
        groceryAgentPreferences: {
          volunteer: !state.groceryAgentPreferences.volunteer,
        },
      };
    case baseActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
