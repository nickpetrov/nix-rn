import moment from 'moment-timezone';

import {guessMealTypeByTime} from '../../helpers/foodLogHelpers';
import {userLogActionTypes} from './userLog.types';
import {Dispatch} from 'redux';
import {RootState} from '../index';

export const getDayTotals = (
  beginDate: string,
  endDate: string,
  userId: number,
  dispatch: Dispatch,
) => {
  return async () => {
    // const jwt = useState().auth.userJWT;
    const response = await fetch(
      `https://trackapi.nutritionix.com/v2/reports/totals${
        userId ? `/${userId}` : ''
      }?begin=${beginDate}&end=${endDate}&timezone=${'US/Eastern'}`,
      {
        headers: {
          'Content-Type': 'application/json',
          // 'x-user-jwt': jwt,
        },
      },
    );

    const totals = await response.json();

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

    const jwt = useState().auth.userJWT;
    const response = await fetch(
      `https://trackapi.nutritionix.com/v2/log${
        userId ? `/${userId}` : ''
      }?offset=${offset}&begin=${beginDate}&end=${endDate}&limit=${'500'}&timezone=${'US/Eastern'}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-user-jwt': jwt,
        },
      },
    );

    const userFoodlog = await response.json();

    dispatch({
      type: userLogActionTypes.GET_USER_FOODLOG,
      foodLog: userFoodlog.foods,
    });
    const beginDateSelected = useState().userLog.selectedDate;

    getDayTotals(beginDateSelected, endDate, userId, dispatch);
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

    const jwt = useState().auth.userJWT;
    const response = await fetch(
      `https://trackapi.nutritionix.com/v2/weight/log${
        userId ? `/${userId}` : ''
      }?offset=${offset}&begin=${beginDate}&end=${endDate}&limit=${'500'}&timezone=${'US/Eastern'}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-user-jwt': jwt,
        },
      },
    );

    const result = await response.json();

    dispatch({
      type: userLogActionTypes.GET_USER_WEIGHT_LOG,
      weights: result.weights,
    });
  };
};

export const addWeightlog = (weights: any) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const jwt = useState().auth.userJWT;
    const response = await fetch(
      `https://trackapi.nutritionix.com/v2/weight/log`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-user-jwt': jwt,
        },
        method: 'POST',
        body: JSON.stringify({weights}),
      },
    );

    const result = await response.json();

    if (result.weights)
      dispatch({
        type: userLogActionTypes.ADD_WEIGHT_LOG,
        weights: result.weights,
      });
  };
};

export const updateWeightlog = (weights: any) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const jwt = useState().auth.userJWT;
    const response = await fetch(
      `https://trackapi.nutritionix.com/v2/weight/log`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-user-jwt': jwt,
        },
        method: 'PUT',
        body: JSON.stringify({weights}),
      },
    );

    const result = await response.json();

    if (result.weights)
      dispatch({
        type: userLogActionTypes.UPDATE_WEIGHT_LOG,
        weights: result.weights,
      });
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

    const jwt = useState().auth.userJWT;
    const response = await fetch(
      `https://trackapi.nutritionix.com/v2/exercise/log${
        userId ? `/${userId}` : ''
      }?offset=${offset}&begin=${beginDate}&end=${endDate}&limit=${'500'}&timezone=${'US/Eastern'}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-user-jwt': jwt,
        },
      },
    );

    const result = await response.json();
    console.log('result', result);
    dispatch({
      type: userLogActionTypes.GET_USER_EXERCISES_LOG,
      exercises: result.exercises,
    });
  };
};

export const addExerciseToLog = (query: string) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const jwt = useState().auth.userJWT;
    const selectedDate = useState().userLog.selectedDate;

    const checkResponse = await fetch(
      `https://trackapi.nutritionix.com/v2/natural/exercise`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-user-jwt': jwt,
        },
        method: 'POST',
        body: JSON.stringify({query}),
      },
    );

    const checkResult = await checkResponse.json();

    if (checkResult.exercises?.length > 0) {
      const response = await fetch(
        `https://trackapi.nutritionix.com/v2/exercise/log`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-user-jwt': jwt,
          },
          method: 'POST',
          body: JSON.stringify({
            exercises: [
              {
                ...checkResult.exercises[0],
                timestamp: moment(selectedDate)
                  .hours(moment().hours())
                  .minutes(moment().minutes()),
              },
            ],
          }),
        },
      );

      const result = await response.json();

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
    const jwt = useState().auth.userJWT;
    const selectedDate = useState().userLog.selectedDate;

    const checkResponse = await fetch(
      `https://trackapi.nutritionix.com/v2/natural/exercise`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-user-jwt': jwt,
        },
        method: 'POST',
        body: JSON.stringify({query}),
      },
    );

    const checkResult = await checkResponse.json();

    if (checkResult.exercises?.length > 0) {
      const response = await fetch(
        `https://trackapi.nutritionix.com/v2/exercise/log`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-user-jwt': jwt,
          },
          method: 'PUT',
          body: JSON.stringify({
            exercises: [
              {
                ...exercise,
                ...checkResult.exercises[0],
                timestamp: moment(selectedDate)
                  .hours(moment().hours())
                  .minutes(moment().minutes()),
              },
            ],
          }),
        },
      );

      const result = await response.json();

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

    const jwt = useState().auth.userJWT;
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

    const response = await fetch(`https://trackapi.nutritionix.com/v2/log`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-jwt': jwt,
      },
      method: 'POST',
      body: JSON.stringify({...loggingOptions, foods: foodArray}),
    });

    const result = await response.json();

    dispatch({
      type: userLogActionTypes.ADD_FOOD_TO_LOG,
      foodObj: result.foods,
    });
  };
};

export const DeleteFoodFromLog = (foodIds: Array<any>) => {
  return async (dispatch: Dispatch) => {
    // const jwt = useState().auth.userJWT;

    // const response = await fetch(`https://trackapi.nutritionix.com/v2/log`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-user-jwt': jwt,
    //   },
    //   method: 'DELETE',
    //   body: JSON.stringify({foods: foodIds}),
    // });

    // const result = await response.json();

    dispatch({
      type: userLogActionTypes.DELETE_FOOD_FROM_LOG,
      foodIds: foodIds.map(item => item.id),
    });
  };
};

export const setDayNotes = (targetDate: any, newNotes: any) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const data = {
      dates: [
        {
          date: targetDate,
          notes: newNotes,
        },
      ],
    };

    const jwt = useState().auth.userJWT;
    const response = await fetch(
      `https://trackapi.nutritionix.com/v2/reports/totals`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-jwt': jwt,
        },
        body: JSON.stringify(data),
      },
    );

    const totals = await response.json();
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
