// utils
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    case baseActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
