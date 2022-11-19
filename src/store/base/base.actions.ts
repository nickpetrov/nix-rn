// utils
import moment from 'moment-timezone';

// types
import {Dispatch} from 'redux';
import {
  baseActionTypes,
  InfoMessageType,
  ReviewCheckType,
  userGroceyAgentInfoProps,
} from './base.types';
import {RootState} from '../index';
import SQLite from 'react-native-sqlite-storage';

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
export const setDB = (db: SQLite.SQLiteDatabase) => {
  return {
    type: baseActionTypes.SET_DB,
    payload: db,
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
export const setIsVoiceDisclaimerVisible = (value: boolean) => {
  return {
    type: baseActionTypes.SET_IS_VOICE_DISCLAYMORE_VISIBLE,
    payload: value,
  };
};
export const setHideVoiceDisclaimer = (value: boolean) => {
  return {
    type: baseActionTypes.SET_HIDE_VOICE_DISCLAYMORE,
    payload: value,
  };
};

const needToUpdateUserGroceyAgentInfo = (
  userGroceyAgentInfo: userGroceyAgentInfoProps,
) => {
  const lastCheckedTimestamp = userGroceyAgentInfo.lastCheckedTimestamp || 0;
  const timestamp = new Date().getTime();
  const timestampDifference = timestamp - lastCheckedTimestamp;
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  return timestampDifference > oneDayInMilliseconds;
};

export const initGroceyAgentInfo = () => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const userGroceyAgentInfo = useState().base.userGroceyAgentInfo;
    const userData = useState().auth.userData;
    if (
      userGroceyAgentInfo.grocery_agent === null ||
      needToUpdateUserGroceyAgentInfo(userGroceyAgentInfo)
    ) {
      const timestamp = new Date().getTime();
      const grocery_agent = userData.grocery_agent
        ? userData.grocery_agent
        : null;
      const newUserGroceyAgentInfo = {
        grocery_agent: grocery_agent,
        lastCheckedTimestamp: timestamp,
      };
      dispatch({
        type: baseActionTypes.SET_GROCERY_AGENT_INFO,
        payload: newUserGroceyAgentInfo,
      });
    }
  };
};
