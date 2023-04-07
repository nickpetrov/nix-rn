import {
  WidgetState,
  clearWidgetAction,
  mergeWidgetAction,
  widgetActionTypes,
} from './widget.types';
import {Dispatch} from 'redux';
import {NativeModules} from 'react-native';
import {RootState} from '../index';
const {NutritionixWidget} = NativeModules;
import isEqual from 'lodash/isEqual';

export const mergeWidget = (data: Partial<WidgetState>) => {
  return async (
    dispatch: Dispatch<mergeWidgetAction>,
    useState: () => RootState,
  ) => {
    const widgetData = useState().widget;
    const oldWidgetData = {
      burned: widgetData.burned,
      consumed: widgetData.consumed,
      limit: widgetData.limit,
      date: widgetData.date,
    };
    if (!isEqual({...oldWidgetData}, data)) {
      try {
        await NutritionixWidget.updateData(data);
      } catch (error) {
        console.log('Error saving data: ', error);
      }
      dispatch({
        type: widgetActionTypes.MERGE_WIDGET,
        payload: data,
      });
    }
  };
};

export const clearWidget = (): clearWidgetAction => {
  return {type: widgetActionTypes.WIDGET_CLEAR};
};
