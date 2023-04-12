import {
  WidgetState,
  clearWidgetAction,
  mergeWidgetAction,
  widgetActionTypes,
} from './widget.types';
import {Dispatch} from 'redux';
import {NativeModules, Platform} from 'react-native';
import {RootState} from '../index';
const {NutritionixWidget, RNUserDefaults} = NativeModules;
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
      if (Platform.OS === 'ios') {
        RNUserDefaults.set(
          'caloriesBurned',
          data.burned,
          'group.nutritionix.nixtrack',
        );
        RNUserDefaults.set(
          'caloriesConsumed',
          data.consumed,
          'group.nutritionix.nixtrack',
        );
        RNUserDefaults.set(
          'caloriesLimit',
          data.limit,
          'group.nutritionix.nixtrack',
        );
        RNUserDefaults.set(
          'caloriesUpdateDate',
          data.date,
          'group.nutritionix.nixtrack',
        );
      } else {
        try {
          await NutritionixWidget.updateData(data);
        } catch (error) {
          console.log('Error saving data: ', error);
        }
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
