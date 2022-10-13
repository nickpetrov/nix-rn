//types
import {coachActionTypes, CoachsState} from './coach.types';
import {AnyAction} from 'redux';

const initialState: CoachsState = {
  clientTotals: [],
};

export default (state: CoachsState = initialState, action: AnyAction) => {
  switch (action.type) {
    case coachActionTypes.GET_CLIENT_TOTTALS:
      return {...state, clientTotals: action.payload};

    case coachActionTypes.CLEAR:
      return initialState;
    default:
      return state;
  }
};
