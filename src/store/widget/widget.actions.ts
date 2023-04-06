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
    const oldWidgetData = useState().widget;

    if (!isEqual(oldWidgetData, data)) {
      try {
        await NutritionixWidget.updateData(data);
        console.log('Data saved successfully');
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
