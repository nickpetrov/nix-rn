//types
import {statsActionTypes, StatsState} from './stats.types';
import {AnyAction} from 'redux';

const initialState: StatsState = {
  dates: [],
  weights: [],
};

export default (state: StatsState = initialState, action: AnyAction) => {
  switch (action.type) {
    case statsActionTypes.STATS_GET_DAY_TOTALS:
      const stateWithTotals = {...state, dates: action.dates};
      return stateWithTotals;
    case statsActionTypes.STATS_GET_WEIGHTS:
      return {...state, weights: action.weights};
    case statsActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
