// utils
import moment from 'moment-timezone';

//helpers
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';

// services
import userLogService from 'api/userLogService';

// types
import {
  ExerciseProps,
  FoodProps,
  loggingOptionsProps,
  userLogActionTypes,
  WeightProps,
} from './userLog.types';
import {Dispatch} from 'redux';
import {RootState} from '../index';

export const getDayTotals = (
  beginDate: string,
  endDate: string,
  timezone: string,
  dispatch: Dispatch,
) => {
  return async () => {
    const response = await userLogService.getTotals({
      beginDate,
      endDate,
      timezone,
    });

    const totals = response.data;
    if (__DEV__) {
      console.log('totals', totals);
    }
    if (totals.dates) {
      dispatch({
        type: userLogActionTypes.GET_DAY_TOTALS,
        totals: totals.dates || [],
      });
    }
  };
};

export const getUserFoodlog = (
  beginDate: string,
  endDate: string,
  offset: number | undefined,
) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');

    const timezone = useState().auth.userData.timezone;
    const response = await userLogService.getUserFoodlog({
      beginDate,
      endDate,
      offset,
      timezone,
    });

    const userFoodlog = response.data;
    if (__DEV__) {
      console.log('userFoodlog', userFoodlog.foods);
    }
    if (userFoodlog.foods) {
      dispatch({
        type: userLogActionTypes.GET_USER_FOODLOG,
        foodLog: userFoodlog.foods,
      });
    }
    const beginDateSelected = useState().userLog.selectedDate;

    getDayTotals(beginDateSelected, endDate, timezone, dispatch);
  };
};

export const getUserWeightlog = (
  beginDate: string,
  endDate: string,
  offset: number | undefined,
) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');

    const timezone = useState().auth.userData.timezone;
    const response = await userLogService.getUserWeightlog({
      beginDate,
      endDate,
      offset,
      timezone,
    });

    const result = response.data;
    if (__DEV__) {
      console.log('weightsLog', result.weights);
    }
    if (result.weights) {
      dispatch({
        type: userLogActionTypes.GET_USER_WEIGHT_LOG,
        weights: result.weights,
      });
    }
  };
};

export const addWeightlog = (weights: Array<Partial<WeightProps>>) => {
  return async (dispatch: Dispatch) => {
    const response = await userLogService.addWeightlog(weights);

    const result = response.data;

    if (result.weights) {
      dispatch({
        type: userLogActionTypes.ADD_WEIGHT_LOG,
        weights: result.weights,
      });
    }
  };
};

export const updateWeightlog = (weights: Array<WeightProps>) => {
  return async (dispatch: Dispatch) => {
    const response = await userLogService.updateWeightlog(weights);

    const result = response.data;

    if (result.weights) {
      dispatch({
        type: userLogActionTypes.UPDATE_WEIGHT_LOG,
        weights: result.weights,
      });
    }
  };
};

export const getUserExerciseslog = (
  beginDate: string,
  endDate: string,
  offset: number | undefined,
) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');

    const timezone = useState().auth.userData.timezone;
    const response = await userLogService.getUserExerciseslog({
      beginDate,
      endDate,
      offset,
      timezone,
    });

    const result = response.data;
    if (__DEV__) {
      console.log('exercisesLog', result.exercises);
    }
    if (result.exercises) {
      dispatch({
        type: userLogActionTypes.GET_USER_EXERCISES_LOG,
        exercises: result.exercises,
      });
    }
  };
};

export const addExerciseToLog = (query: string) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const selectedDate = useState().userLog.selectedDate;

    const checkResponse = await userLogService.getExerciseByQuery(query);

    const checkResult = checkResponse.data;

    if (checkResult.exercises?.length > 0) {
      const response = await userLogService.addExerciseLog([
        {
          ...checkResult.exercises[0],
          timestamp: moment(selectedDate)
            .hours(moment().hours())
            .minutes(moment().minutes()),
        },
      ]);

      const result = response.data;

      if (result.exercises) {
        dispatch({
          type: userLogActionTypes.ADD_USER_EXERCISES_LOG,
          exercises: result.exercises,
        });
      }
    } else {
      return {error: true};
    }
  };
};

export const updateExerciseToLog = (query: string, exercise: ExerciseProps) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const selectedDate = useState().userLog.selectedDate;

    const checkResponse = await userLogService.getExerciseByQuery(query);

    const checkResult = checkResponse.data;

    if (checkResult.exercises?.length > 0) {
      const response = await userLogService.updateExerciseLog([
        {
          ...exercise,
          ...checkResult.exercises[0],
          timestamp: moment(selectedDate)
            .hours(moment().hours())
            .minutes(moment().minutes()),
        },
      ]);

      const result = response.data;

      if (result.exercises) {
        dispatch({
          type: userLogActionTypes.UPDATE_USER_EXERCISES_LOG,
          exercises: result.exercises,
        });
      }
    } else {
      return {error: true};
    }
  };
};

export const addFoodToLog = (
  foodArray: Array<FoodProps>,
  loggingOptions: Partial<loggingOptionsProps>,
) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    // logging options:
    // "aggregate": "string",
    // "aggregate_photo": {},
    // "serving_qty": 0,
    // "consumed_at": "string",
    // "brand_name": "string",
    // "meal_type": 0
    loggingOptions.consumed_at = moment(loggingOptions.consumed_at).format(
      'MM-DD-YYYY',
    );
    const mealType =
      loggingOptions.meal_type ||
      guessMealTypeByTime(moment(loggingOptions.consumed_at).hour());

    const timezone = useState().auth.userData.timezone;

    // if (loggingOptions.sing)

    foodArray.map((food: FoodProps) => {
      food.consumed_at =
        moment(loggingOptions.consumed_at).format('YYYY-MM-DDTHH:mm:ss') +
        moment.tz(timezone).format('Z');
      food.meal_type = mealType;

      delete food.uuid;
      delete food.public_id;
    });

    const response = await userLogService.addFoodToLog(
      foodArray,
      loggingOptions,
    );

    const result = response.data;

    if (result.foods) {
      dispatch({
        type: userLogActionTypes.ADD_FOOD_TO_LOG,
        foodObj: result.foods,
      });
    }
  };
};

export const DeleteFoodFromLog = (foodIds: Array<{id: string}>) => {
  return async (dispatch: Dispatch) => {
    const response = await userLogService.deleteFoodFromLog(foodIds);

    if (response.status === 200) {
      dispatch({
        type: userLogActionTypes.DELETE_FOOD_FROM_LOG,
        foodIds: foodIds.map(item => item.id),
      });
    }
  };
};

export const setDayNotes = (targetDate: string, newNotes: string) => {
  return async (dispatch: Dispatch) => {
    const data = {
      dates: [
        {
          date: targetDate,
          notes: newNotes,
        },
      ],
    };

    const response = await userLogService.setDayNotes(data);

    const totals = response.data;

    if (totals.dates) {
      dispatch({
        type: userLogActionTypes.SET_DAY_NOTES,
        totals: totals.dates || [],
      });
    }
  };
};

export const changeSelectedDay = (newDate: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: userLogActionTypes.CHANGE_SELECTED_DATE,
      newDate: newDate,
    });
  };
};
