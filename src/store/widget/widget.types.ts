export enum widgetActionTypes {
  MERGE_WIDGET = 'MERGE_WIDGET',
  WIDGET_CLEAR = 'WIDGET_CLEAR',
}

export interface WidgetState {
  date: string;
  consumed: number;
  burned: number;
  limit: number;
}

export type mergeWidgetAction = {
  type: widgetActionTypes.MERGE_WIDGET;
  payload: Partial<WidgetState>;
};
export type clearWidgetAction = {
  type: widgetActionTypes.WIDGET_CLEAR;
};

export type WidgetActions = mergeWidgetAction | clearWidgetAction;
