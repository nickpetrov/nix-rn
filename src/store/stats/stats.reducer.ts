//types
import {statsActionTypes, StatsState} from './stats.types';
import {AnyAction} from 'redux';

const initialState: StatsState = {
  dates: [],
  weights: [],
};

export default (
  state: StatsState = initialState,
  action: AnyAction,
): StatsState => {
  switch (action.type) {
    case statsActionTypes.STATS_GET_DAY_TOTALS:
      const stateWithTotals = {...state, dates: action.dates};
      return stateWithTotals;
    case statsActionTypes.STATS_GET_WEIGHTS: {
      let newWeights = [];
      if (action.add) {
        newWeights = state.weights.concat(action.weights);
      } else {
        newWeights = action.weights;
      }
      return {...state, weights: newWeights};
    }
    case statsActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
