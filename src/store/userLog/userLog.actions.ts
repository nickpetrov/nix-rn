// utils
import moment from 'moment-timezone';

//helpers
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';

// services
import userLogService from 'api/userLogService';

// types
import {userLogActionTypes} from './userLog.types';
import {Dispatch} from 'redux';
import {RootState} from '../index';

export const getDayTotals = (
  beginDate: string,
  endDate: string,
  userId: number,
  timezone: string,
  dispatch: Dispatch,
) => {
  return async () => {
    const response = await userLogService.getTotals({
      beginDate,
      endDate,
      userId,
      timezone,
    });

    const totals = response.data;

    dispatch({
      type: userLogActionTypes.GET_DAY_TOTALS,
      totals: totals.dates || [],
    });
  };
};

export const getUserFoodlog = (
  beginDate: string,
  endDate: string,
  offset: number | undefined,
  userId: number,
) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');

    const timezone = useState().auth.userData.timezone;
    const response = await userLogService.getUserFoodlog({
      beginDate,
      endDate,
      offset,
      userId,
      timezone,
    });

    const userFoodlog = response.data;

    dispatch({
      type: userLogActionTypes.GET_USER_FOODLOG,
      foodLog: userFoodlog.foods,
    });
    const beginDateSelected = useState().userLog.selectedDate;

    getDayTotals(beginDateSelected, endDate, userId, timezone, dispatch);
  };
};

export const getUserWeightlog = (
  beginDate: string,
  endDate: string,
  offset: number | undefined,
  userId: number,
) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');

    const timezone = useState().auth.userData.timezone;
    const response = await userLogService.getUserWeightlog({
      beginDate,
      endDate,
      offset,
      userId,
      timezone,
    });

    const result = response.data;

    dispatch({
      type: userLogActionTypes.GET_USER_WEIGHT_LOG,
      weights: result.weights,
    });
  };
};

export const addWeightlog = (weights: any) => {
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

export const updateWeightlog = (weights: any) => {
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
  userId: number,
) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');

    const timezone = useState().auth.userData.timezone;
    const response = await userLogService.getUserExerciseslog({
      beginDate,
      endDate,
      offset,
      userId,
      timezone,
    });

    const result = response.data;

    dispatch({
      type: userLogActionTypes.GET_USER_EXERCISES_LOG,
      exercises: result.exercises,
    });
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

      dispatch({
        type: userLogActionTypes.ADD_USER_EXERCISES_LOG,
        exercises: result.exercises,
      });
    } else {
      return {error: true};
    }
  };
};

export const updateExerciseToLog = (query: string, exercise: any) => {
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

      dispatch({
        type: userLogActionTypes.UPDATE_USER_EXERCISES_LOG,
        exercises: result.exercises,
      });
    } else {
      return {error: true};
    }
  };
};

export const addFoodToLog = (foodArray: any, loggingOptions: any) => {
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

    foodArray.map((food: any) => {
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

    dispatch({
      type: userLogActionTypes.ADD_FOOD_TO_LOG,
      foodObj: result.foods,
    });
  };
};

export const DeleteFoodFromLog = (foodIds: Array<any>) => {
  return async (dispatch: Dispatch) => {
    const response = await userLogService.deleteFoodFromLog(foodIds);
    console.log('DeleteFoodFromLog', response);
    const result = response.data;

    if (result.id) {
      dispatch({
        type: userLogActionTypes.DELETE_FOOD_FROM_LOG,
        foodIds: foodIds.map(item => item.id),
      });
    }
  };
};

export const setDayNotes = (targetDate: any, newNotes: any) => {
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

    dispatch({
      type: userLogActionTypes.SET_DAY_NOTES,
      totals: totals.dates || [],
    });
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
