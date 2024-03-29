// utils
import moment from 'moment';

// types
import {authActionTypes, logoutAction} from 'store/auth/auth.types';
import {
  ExerciseProps,
  UserLogActions,
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
  dateRange: null,
};

export default (
  state: UserLogState = initialState,
  action: UserLogActions | logoutAction,
): UserLogState => {
  switch (action.type) {
    case userLogActionTypes.GET_USER_FOODLOG:
      return {...state, foods: action.foodLog};
    case userLogActionTypes.CHANGE_FOOD_LOG_DATE_RANGE:
      return {...state, dateRange: action.payload};
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
      return {...state, exercises: newExercises};
    }
    case userLogActionTypes.ADD_FOOD_TO_LOG: {
      const foodToAdd = !Array.isArray(action.payload)
        ? [action.payload]
        : action.payload;
      return {...state, foods: state.foods.concat(foodToAdd)};
    }
    case userLogActionTypes.UPDATE_FOOD_FROM_LOG: {
      const newFoods = [...state.foods];
      const changedFoodIndex = newFoods.findIndex(
        item => item.id === action.payload.id,
      );
      if (changedFoodIndex !== -1) {
        newFoods[changedFoodIndex] = action.payload;
      }
      return {...state, foods: newFoods};
    }
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
    case userLogActionTypes.UPDATE_DAY_TOTALS: {
      let newTotals = [...state.totals];
      let changedDayIndex = newTotals.findIndex(
        item => item.date === action.totals[0].date,
      );
      if (changedDayIndex !== -1) {
        newTotals[changedDayIndex] = {
          ...newTotals[changedDayIndex],
          ...action.totals[0],
        };
      } else {
        newTotals = action.totals;
      }
      const stateWithUpdatedTotals = {...state, totals: newTotals};
      return stateWithUpdatedTotals;
    }
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
    case authActionTypes.UPDATE_USER_DATA: {
      const newTotals = [...state.totals];
      const currDate = newTotals.find(
        item =>
          moment(item.date).format('YYYY-MM-DD') ===
          moment().format('YYYY-MM-DD'),
      );
      if (currDate) {
        currDate.daily_kcal_limit =
          action.newUserObj.daily_kcal || currDate.daily_kcal_limit;
      }
      return {...state, totals: newTotals};
    }
    case authActionTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
};
