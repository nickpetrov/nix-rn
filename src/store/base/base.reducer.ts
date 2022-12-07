// utils
import {Platform} from 'react-native';
import {
  getModel,
  getVersion,
  getManufacturer,
  getReadableVersion,
} from 'react-native-device-info';

//types
import {BaseActions, baseActionTypes, BaseState} from './base.types';

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
  userGroceyAgentInfo: {
    grocery_agent: null,
    lastCheckedTimestamp: 0,
  },
  db: null,
  isVoiceDisclaimerVisible: false,
  hideVoiceRecognitionDisclaimer: false,
  offline: false,
};

export default (
  state: BaseState = initialState,
  action: BaseActions,
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
    case baseActionTypes.SET_DB:
      return {...state, db: action.payload};
    case baseActionTypes.SET_HIDE_VOICE_DISCLAYMORE:
      return {...state, hideVoiceRecognitionDisclaimer: action.payload};
    case baseActionTypes.SET_IS_VOICE_DISCLAYMORE_VISIBLE:
      return {...state, isVoiceDisclaimerVisible: action.payload};
    case baseActionTypes.SET_GROCERY_AGENT_INFO:
      return {...state, userGroceyAgentInfo: action.payload};
    case baseActionTypes.SET_OFFLINE_MODE:
      return {...state, offline: action.payload};
    case baseActionTypes.RESET_GROCERY_SETTINGS:
      return {
        ...state,
        userGroceyAgentInfo: {
          grocery_agent: null,
          lastCheckedTimestamp: 0,
        },
        groceryAgentPreferences: {
          volunteer: false,
        },
      };
    case baseActionTypes.BASE_CLEAR:
      return initialState;
    default:
      return state;
  }
};
