export enum walkthroughActionTypes {
  SET_CHECKED_EVENTS = 'SET_CHECKED_EVENTS',
  SET_CONTENT = 'SET_CONTENT',
  WALKTHROUGH_CLEAR = 'WALKTHROUGH_CLEAR',
}

export type ContentType = {
  title: string;
  text: string;
};

export type CheckedEventsType = {
  firstLogin: {value: boolean; steps: ContentType[]};
  firstFoodAddedToFoodLog: {value: boolean; steps: ContentType[]};
  firstFoodAddedToBasket: {value: boolean; steps: ContentType[]};
  firstMultipleFoodsInBasket: {value: boolean; steps: ContentType[]};
  firstEnterInTrackTab: {value: boolean; steps: ContentType[]};
  firstOfflineMode: {value: boolean; steps: ContentType[]};
};

export interface WalkthroughState {
  checkedEvents: CheckedEventsType;
  currentTooltip: {
    eventName: keyof CheckedEventsType;
    step: number;
  } | null;
}

export type clearWalkthroghAction = {
  type: walkthroughActionTypes.WALKTHROUGH_CLEAR;
};
export type setCurrentTooltipAction = {
  type: walkthroughActionTypes.SET_CONTENT;
  payload: {
    eventName: keyof CheckedEventsType;
    step: number;
  };
};
export type setCheckedEventAction = {
  type: walkthroughActionTypes.SET_CHECKED_EVENTS;
  payload: {
    name: keyof CheckedEventsType;
    value: boolean;
  };
};

export type WalkthroughActions =
  | clearWalkthroghAction
  | setCheckedEventAction
  | setCurrentTooltipAction;
