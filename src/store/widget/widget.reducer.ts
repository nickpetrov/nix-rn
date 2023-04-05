//types
import moment from 'moment-timezone';
import {WidgetActions, widgetActionTypes, WidgetState} from './widget.types';

const initialState: WidgetState = {
  date: moment().format('YYYY-MM-DD'),
  consumed: 0,
  burned: 0,
  limit: 2000,
};

export default (
  state: WidgetState = initialState,
  action: WidgetActions,
): WidgetState => {
  switch (action.type) {
    case widgetActionTypes.MERGE_WIDGET: {
      return {...state, ...action.payload};
    }
    case widgetActionTypes.WIDGET_CLEAR:
      return initialState;
    default:
      return state;
  }
};
