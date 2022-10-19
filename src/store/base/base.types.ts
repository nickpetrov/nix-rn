export enum baseActionTypes {
  SET_USER_AGREED_TO_USE_PHOTO = 'SET_USER_AGREED_TO_USE_PHOTO',
  DISPLAY_AGREEMENT_POPUP = 'DISPLAY_AGREEMENT_POPUP',
  SET_INFO_MESSAGE = 'SET_INFO_MESSAGE',
  TOGGLE_ASK_FOR_REVIEW = 'TOGGLE_ASK_FOR_REVIEW',
  CLEAR = 'CLEAR',
}

export type ReviewCheckType = {
  rateClicked: boolean;
  scheduleDate: string | null;
  lastRunDate: string | null;
  runCounter: number;
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
  infoMessage: string;
  askForReview: boolean;
  reviewCheck: ReviewCheckType;
};

export type BugReportType = {
  type: number;
  feedback: string;
  payload?: string;
  metadata?: string;
};
