import {
  CheckedEventsType,
  clearWalkthroghAction,
  setCheckedEventAction,
  setCurrentTooltipAction,
  walkthroughActionTypes,
} from './walkthrough.types';

export const setCheckedEvents = (
  eventName: keyof CheckedEventsType,
  value: boolean,
): setCheckedEventAction => {
  return {
    type: walkthroughActionTypes.SET_CHECKED_EVENTS,
    payload: {
      name: eventName,
      value,
    },
  };
};
export const setWalkthroughTooltip = (
  eventName: keyof CheckedEventsType,
  step: number,
  forbidBack?: boolean,
): setCurrentTooltipAction => {
  return {
    type: walkthroughActionTypes.SET_CURRENT_TOOLTIP,
    payload: {
      eventName: eventName,
      step,
      forbidBack,
    },
  };
};

export const resetWalkthrogh = (): clearWalkthroghAction => {
  return {
    type: walkthroughActionTypes.WALKTHROUGH_CLEAR,
  };
};
