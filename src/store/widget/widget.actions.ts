import {
  WidgetState,
  clearWidgetAction,
  mergeWidgetAction,
  widgetActionTypes,
} from './widget.types';
import {Dispatch} from 'redux';
import {NativeModules} from 'react-native';
const {SharedPreferencesModule} = NativeModules;

export const mergeWidget = (data: Partial<WidgetState>) => {
  return async (dispatch: Dispatch<mergeWidgetAction>) => {
    try {
      await SharedPreferencesModule.writeData('widget', JSON.stringify(data));
      console.log('Data saved successfully');
    } catch (error) {
      console.log('Error saving data: ', error);
    }
    dispatch({
      type: widgetActionTypes.MERGE_WIDGET,
      payload: data,
    });
  };
};

export const clearWidget = (): clearWidgetAction => {
  return {type: widgetActionTypes.WIDGET_CLEAR};
};
