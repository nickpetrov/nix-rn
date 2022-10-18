// utils
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const initialState: BaseState = {
  agreedToUsePhoto: getAgreedToUsePhotoFromStorage(),
  agreementPopup: false,
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
