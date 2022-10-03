// utils
import moment from 'moment';
import {AnyAction} from 'redux';

// types
import {authActionTypes} from 'store/auth/auth.types';
import {
  ExerciseProps,
  userLogActionTypes,
  UserLogState,
  WeightProps,
} from './userLog.types';

const initialState: UserLogState = {
  foods: [],
  totals: [],
  weights: [],
  exercises: [],
  selectedDate: moment().format('YYYY-MM-DD'),
};

export default (state: UserLogState = initialState, action: AnyAction) => {
  switch (action.type) {
    case userLogActionTypes.GET_USER_FOODLOG:
      return {...state, foods: action.foodLog};
    case userLogActionTypes.GET_USER_WEIGHT_LOG:
      return {...state, weights: action.weights || []};
    case userLogActionTypes.ADD_WEIGHT_LOG:
      return {...state, weights: state.weights.concat(action.weights)};
    case userLogActionTypes.UPDATE_WEIGHT_LOG: {
      const newWeights = state.weights.map((item: WeightProps) => {
        if (item.id === action.weights[0].id) {
          return action.weights[0];
        } else {
          return item;
        }
      });
      return {...state, weights: newWeights};
    }
    case userLogActionTypes.GET_USER_EXERCISES_LOG:
      return {...state, exercises: action.exercises || []};
    case userLogActionTypes.ADD_USER_EXERCISES_LOG:
      return {...state, exercises: state.exercises.concat(action.exercises)};
    case userLogActionTypes.UPDATE_USER_EXERCISES_LOG: {
      const newExercises = state.exercises.map((item: ExerciseProps) => {
        if (item.id === action.exercises[0].id) {
          return action.exercises[0];
        } else {
          return item;
        }
      });
      return {...state, weights: newExercises};
    }
    case userLogActionTypes.ADD_FOOD_TO_LOG:
      const foodToAdd = !action.foodObj.length
        ? [action.foodObj]
        : action.foodObj;
      return {...state, foods: state.foods.concat(foodToAdd)};
    case userLogActionTypes.DELETE_FOOD_FROM_LOG:
      let newFoods = [...state.foods];
      newFoods = newFoods.filter(item => !action.foodIds.includes(item.id));
      return {...state, foods: newFoods};
    case userLogActionTypes.DELETE_WEIGHT_FROM_LOG: {
      let newWeights = [...state.weights];
      newWeights = newWeights.filter(item => !action.weights.includes(item.id));
      return {...state, weights: newWeights};
    }
    case userLogActionTypes.DELETE_EXERCISE_FROM_LOG: {
      let newExercises = [...state.exercises];
      newExercises = newExercises.filter(
        item => !action.exercises.includes(item.id),
      );
      return {...state, exercises: newExercises};
    }
    case userLogActionTypes.GET_DAY_TOTALS:
      const stateWithTotals = {...state, totals: action.totals};
      return stateWithTotals;
    case userLogActionTypes.SET_DAY_NOTES:
      const stateWithUpdatedTotals = {...state, totals: action.totals};
      return stateWithUpdatedTotals;
    case userLogActionTypes.CHANGE_SELECTED_DATE:
      const stateWithNewSelectedDate = {
        ...state,
        selectedDate: action.newDate,
      };
      return stateWithNewSelectedDate;
    case userLogActionTypes.UPDATE_WATER_LOG: {
      const newTotals = [...state.totals];
      const changedDate = newTotals.find(
        item => item.date === state.selectedDate,
      );
      if (changedDate) {
        changedDate.water_consumed_liter = action.payload;
      }
      return {...state, totals: newTotals};
    }
    case userLogActionTypes.DELETE_WATER_FROM_LOG: {
      const newTotals = [...state.totals];
      const changedDate = newTotals.find(
        item => item.date === state.selectedDate,
      );
      if (changedDate) {
        changedDate.water_consumed_liter = null;
      }
      return {...state, totals: newTotals};
    }
    case authActionTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
};
