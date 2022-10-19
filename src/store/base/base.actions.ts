// utils
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';

// types
import {Dispatch} from 'redux';
import {baseActionTypes, ReviewCheckType} from './base.types';

export const setAgreedToUsePhoto = (agreedToUsePhoto: boolean) => {
  return async (dispatch: Dispatch) => {
    AsyncStorage.setItem('authData', JSON.stringify(agreedToUsePhoto));
    dispatch({
      type: baseActionTypes.SET_USER_AGREED_TO_USE_PHOTO,
      payload: agreedToUsePhoto,
    });
  };
};

export const getReviewCheckFromStorage = () => {
  return async (dispatch: Dispatch) => {
    const newReviewCheck = await AsyncStorage.getItem('reviewCheck').then(
      data => {
        let reviewCheck: Partial<ReviewCheckType> = {};
        if (data) {
          reviewCheck = {...reviewCheck, ...JSON.parse(data)};
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
        return reviewCheck;
      },
    );
    dispatch({
      type: baseActionTypes.MERGE_REVIEW_CHECK,
      payload: newReviewCheck,
    });
  };
};

export const showAgreementPopup = () => {
  return {
    type: baseActionTypes.DISPLAY_AGREEMENT_POPUP,
  };
};

export const setInfoMessage = (message: string) => {
  return {
    type: baseActionTypes.SET_INFO_MESSAGE,
    payload: message,
  };
};
export const setAskForReview = (askForReview: boolean) => {
  return {
    type: baseActionTypes.TOGGLE_ASK_FOR_REVIEW,
    payload: askForReview,
  };
};
export const mergeReviewCheck = (reviewCheck: Partial<ReviewCheckType>) => {
  return {
    type: baseActionTypes.MERGE_REVIEW_CHECK,
    payload: reviewCheck,
  };
};
