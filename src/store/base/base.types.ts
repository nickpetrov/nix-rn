import SQLite from 'react-native-sqlite-storage';
export enum baseActionTypes {
  SET_USER_AGREED_TO_USE_PHOTO = 'SET_USER_AGREED_TO_USE_PHOTO',
  DISPLAY_AGREEMENT_POPUP = 'DISPLAY_AGREEMENT_POPUP',
  SET_INFO_MESSAGE = 'SET_INFO_MESSAGE',
  TOGGLE_ASK_FOR_REVIEW = 'TOGGLE_ASK_FOR_REVIEW',
  MERGE_REVIEW_CHECK = 'MERGE_REVIEW_CHECK',
  TOGGLE_GROCERY_AGENT_PREFERENCES = 'TOGGLE_GROCERY_AGENT_PREFERENCES',
  SET_DB = 'SET_DB',
  SET_IS_VOICE_DISCLAYMORE_VISIBLE = 'SET_IS_VOICE_DISCLAYMORE_VISIBLE',
  SET_HIDE_VOICE_DISCLAYMORE = 'SET_HIDE_VOICE_DISCLAYMORE',
  SET_GROCERY_AGENT_INFO = 'SET_GROCERY_AGENT_INFO',
  CLEAR = 'CLEAR',
}

export type ReviewCheckType = {
  rateClicked: number | null;
  scheduleDate: string | null;
  lastRunDate: string | null;
  runCounter: number;
  popupShown: 0 | 1;
};

export type InfoMessageType = {
  title?: string;
  text?: string;
  btnText?: string;
  child?: React.ReactNode;
  loadingType?: boolean;
  loadTime?: number;
};

export type userGroceyAgentInfoProps = {
  grocery_agent: null | number;
  lastCheckedTimestamp: number;
};

export type BaseState = {
  agreedToUsePhoto: boolean;
  agreementPopup: boolean;
  deviceInfo: {
    version: string;
    model: string;
    platform: string;
    manufacturer: string;
    appVersion: string;
  };
  infoMessage: null | InfoMessageType;
  askForReview: boolean;
  reviewCheck: ReviewCheckType;
  groceryAgentPreferences: {
    volunteer: boolean;
  };
  userGroceyAgentInfo: userGroceyAgentInfoProps;
  db: null | SQLite.SQLiteDatabase;
  isVoiceDisclaimerVisible: boolean;
  hideVoiceRecognitionDisclaimer: boolean;
};

export type BugReportType = {
  type: number;
  feedback: string;
  payload?: string;
  metadata?: string;
};
