// utils
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import {Platform} from 'react-native';
import {
  getModel,
  getVersion,
  getManufacturer,
  getReadableVersion,
} from 'react-native-device-info';

//types
import {AnyAction} from 'redux';
import {baseActionTypes, BaseState, ReviewCheckType} from './base.types';

const getAgreedToUsePhotoFromStorage = () => {
  let agreedToUsePhoto = false;
  AsyncStorage.getItem('agreedToUsePhoto').then(data => {
    if (data) {
      const agreedToUsePhotoStorage = JSON.parse(data);
      if (agreedToUsePhotoStorage) {
        agreedToUsePhoto = agreedToUsePhotoStorage;
      }
    }
  });

  return agreedToUsePhoto;
};

const getReviewCheck = () => {
  let reviewCheck: ReviewCheckType = {
    rateClicked: false,
    scheduleDate: null,
    lastRunDate: null,
    runCounter: 0,
  };
  AsyncStorage.getItem('reviewCheck').then(data => {
    if (data) {
      reviewCheck = JSON.parse(data);
      reviewCheck.lastRunDate =
        reviewCheck.lastRunDate || moment().format('DD-MM-YYYY');
      reviewCheck.runCounter = reviewCheck.runCounter || 0;
    } else {
      reviewCheck.runCounter = 0;
      reviewCheck.lastRunDate = moment().format('DD-MM-YYYY');
    }
    if (
      !moment(reviewCheck.lastRunDate, 'DD-MM-YYYY')
        .startOf('day')
        .isSame(moment().startOf('day'))
    ) {
      reviewCheck.runCounter++;
      reviewCheck.lastRunDate = moment().format('DD-MM-YYYY');
    }
    AsyncStorage.setItem('reviewCheck', JSON.stringify(reviewCheck));
  });

  return reviewCheck;
};

let manufacturer = '';
getManufacturer().then(m => {
  manufacturer = m;
});

const initialState: BaseState = {
  agreedToUsePhoto: getAgreedToUsePhotoFromStorage(),
  agreementPopup: false,
  deviceInfo: {
    version: getVersion(),
    model: getModel(),
    platform: Platform.OS,
    manufacturer: manufacturer,
    appVersion: getReadableVersion(),
  },
  infoMessage: '',
  askForReview: false,
  reviewCheck: getReviewCheck(),
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
    case baseActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
