// utils
import AsyncStorage from '@react-native-async-storage/async-storage';

// types
import {Dispatch} from 'redux';
import {baseActionTypes} from './base.types';

export const setAgreedToUsePhoto = (agreedToUsePhoto: boolean) => {
  return async (dispatch: Dispatch) => {
    AsyncStorage.setItem('authData', JSON.stringify(agreedToUsePhoto));
    dispatch({
      type: baseActionTypes.SET_USER_AGREED_TO_USE_PHOTO,
      payload: agreedToUsePhoto,
    });
  };
};

export const showAgreementPopup = () => {
  return {
    type: baseActionTypes.DISPLAY_AGREEMENT_POPUP,
  };
};
