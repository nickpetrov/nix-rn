// utils
import moment from 'moment-timezone';

// types
import {Dispatch} from 'redux';
import {baseActionTypes, InfoMessageType, ReviewCheckType} from './base.types';
import {RootState} from '../index';

export const setAgreedToUsePhoto = (agreedToUsePhoto: boolean) => {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: baseActionTypes.SET_USER_AGREED_TO_USE_PHOTO,
      payload: agreedToUsePhoto,
    });
  };
};

export const updateReviewCheckAfterComeBack = () => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const oldReviewCheck = useState().base.reviewCheck;
    let reviewCheck: Partial<ReviewCheckType> = {};
    if (oldReviewCheck) {
      reviewCheck = {...reviewCheck, ...oldReviewCheck};
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

    dispatch({
      type: baseActionTypes.MERGE_REVIEW_CHECK,
      payload: reviewCheck,
    });
    return reviewCheck;
  };
};

export const showAgreementPopup = () => {
  return {
    type: baseActionTypes.DISPLAY_AGREEMENT_POPUP,
  };
};

export const setInfoMessage = (data: InfoMessageType | null) => {
  return {
    type: baseActionTypes.SET_INFO_MESSAGE,
    payload: data,
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
export const toggleGroceryAgentPreferences = () => {
  return {
    type: baseActionTypes.TOGGLE_GROCERY_AGENT_PREFERENCES,
  };
};
