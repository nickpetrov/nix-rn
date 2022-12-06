import {
  CheckedEventsType,
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
): setCurrentTooltipAction => {
  return {
    type: walkthroughActionTypes.SET_CONTENT,
    payload: {
      eventName: eventName,
      step,
    },
  };
};
