// utils
import moment from 'moment-timezone';
import {batch} from 'react-redux';
import {Platform} from 'react-native';

//helpers
import {guessMealTypeByTime} from 'helpers/foodLogHelpers';
import * as timeHelper from 'helpers/time.helpers';
import healthkitSync from 'helpers/healthkit/healthkitSync';
import syncWeight from 'helpers/healthkit/HealthKitWeightSync';
import syncExercise from 'helpers/healthkit/HealthKitExerciseSync';

// services
import userLogService from 'api/userLogService';
import baseService from 'api/baseService';

// actions
import {setInfoMessage} from '../base/base.actions';

// types
import {
  ExerciseProps,
  FoodProps,
  loggingOptionsProps,
  userLogActionTypes,
  WeightProps,
  WaterLogProps,
} from './userLog.types';
import {Dispatch} from 'redux';
import {RootState} from '../index';
import {Asset} from 'react-native-image-picker';

export const getDayTotals = (
  beginDate: string,
  endDate: string,
  timezone: string,
) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await userLogService.getTotals({
        beginDate,
        endDate,
        timezone,
      });

      const totals = response.data;
      // if (__DEV__) {
      //   console.log('totals', totals);
      // }
      if (totals.dates) {
        dispatch({
          type: userLogActionTypes.GET_DAY_TOTALS,
          totals: totals.dates || [],
        });
      }
    } catch (error) {
      throw error;
    }
  };
};

export const refreshUserLogTotals = () => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    const selectedDate = useState().userLog.selectedDate;
    const timezone = useState().auth.userData.timezone;
    const logBeginDate = timeHelper.offsetDays(selectedDate, 'YYYY-MM-DD', -7);
    const logEndDate = timeHelper.offsetDays(selectedDate, 'YYYY-MM-DD', 7);
    dispatch(getDayTotals(logBeginDate, logEndDate, timezone));
  };
};

export const getUserFoodlog = (
  beginDate: string,
  endDate: string,
  offset: number | undefined,
) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');

    const timezone = useState().auth.userData.timezone;

    try {
      const response = await userLogService.getUserFoodlog({
        beginDate,
        endDate,
        offset,
        timezone,
      });

      const userFoodlog = response.data;
      // if (__DEV__) {
      //   console.log('userFoodlog', userFoodlog.foods);
      // }
      if (userFoodlog.foods) {
        dispatch({
          type: userLogActionTypes.GET_USER_FOODLOG,
          foodLog: userFoodlog.foods,
        });
      }
      const beginDateSelected = useState().userLog.selectedDate;
      const hkSyncOptions = useState().connectedApps.hkSyncOptions;
      if (hkSyncOptions.nutrition === 'push' && Platform.OS === 'ios') {
        const db = useState().base.db;
        healthkitSync(userFoodlog.foods, db);
      }

      dispatch(getDayTotals(beginDateSelected, endDate, timezone));
    } catch (error) {
      throw error;
    }
  };
};

export const getUserWeightlog = (
  begin: string,
  endDate: string,
  offset: number | undefined,
) => {
  return async (dispatch: Dispatch, useState: () => RootState) => {
    const end = moment(endDate, 'YYYY-MM-DD')
      .add(1, 'day')
      .format('YYYY-MM-DD');

    const timezone = useState().auth.userData.timezone;

    try {
      const response = await userLogService.getUserWeightlog({
        begin,
        end,
        offset,
        timezone,
      });

      const result = response.data;
      // if (__DEV__) {
      //   console.log('weightsLog', result.weights);
      // }
      if (result.weights) {
        dispatch({
          type: userLogActionTypes.GET_USER_WEIGHT_LOG,
          weights: result.weights,
        });
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.weight === 'push' && Platform.OS === 'ios') {
          const db = useState().base.db;
          syncWeight(db, result.weights);
        }
      }
    } catch (error) {
      throw error;
    }
  };
};

export const addWeightlog = (weights: Array<Partial<WeightProps>>) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    try {
      const response = await userLogService.addWeightlog(weights);

      const result = response.data;

      if (result.weights) {
        dispatch({
          type: userLogActionTypes.ADD_WEIGHT_LOG,
          weights: result.weights,
        });
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.weight === 'push' && Platform.OS === 'ios') {
          const oldWeights = useState().userLog.weights;
          const db = useState().base.db;
          syncWeight(db, oldWeights.concat(result.weights));
        }
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const updateWeightlog = (weights: Array<WeightProps>) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    try {
      const response = await userLogService.updateWeightlog(weights);

      const result = response.data;

      if (result.weights) {
        dispatch({
          type: userLogActionTypes.UPDATE_WEIGHT_LOG,
          weights: result.weights,
        });
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.weight === 'push' && Platform.OS === 'ios') {
          const oldWeights = useState().userLog.weights;
          const newWeights = oldWeights.map((item: WeightProps) => {
            if (item.id === result.weights[0].id) {
              return result.weights[0];
            } else {
              return item;
            }
          });
          const db = useState().base.db;
          syncWeight(db, newWeights);
        }
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const deleteWeightFromLog = (weights: Array<{id: string}>) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    try {
      const response = await userLogService.deleteWeightFromLog(weights);

      if (response.status === 200) {
        const deletedIds = weights.map(item => item.id);
        dispatch({
          type: userLogActionTypes.DELETE_WEIGHT_FROM_LOG,
          weights: weights.map(item => item.id),
        });
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.weight === 'push' && Platform.OS === 'ios') {
          const oldWeights = useState().userLog.weights;
          const db = useState().base.db;
          syncWeight(
            db,
            oldWeights.filter(item => !deletedIds.includes(item.id)),
          );
        }
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};
export const deleteExerciseFromLog = (exercises: Array<{id: string}>) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    try {
      const response = await userLogService.deleteExerciseFromLog(exercises);

      if (response.status === 200) {
        const deletedExercisesIds = exercises.map(item => item.id);
        dispatch({
          type: userLogActionTypes.DELETE_EXERCISE_FROM_LOG,
          exercises: deletedExercisesIds,
        });
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.exercise === 'push' && Platform.OS === 'ios') {
          const oldExercises = useState().userLog.exercises;
          const db = useState().base.db;
          syncExercise(
            db,
            oldExercises.filter(item => !deletedExercisesIds.includes(item.id)),
          );
        }
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
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
    try {
      const response = await userLogService.getUserExerciseslog({
        beginDate,
        endDate,
        offset,
        timezone,
      });

      const result = response.data;
      // if (__DEV__) {
      //   console.log('exercisesLog', result.exercises);
      // }
      if (result.exercises) {
        dispatch({
          type: userLogActionTypes.GET_USER_EXERCISES_LOG,
          exercises: result.exercises,
        });
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.exercise === 'push' && Platform.OS === 'ios') {
          const db = useState().base.db;
          syncExercise(db, result.exercises);
        }
      }
    } catch (error) {
      throw error;
    }
  };
};

export const addExistExercisesToLog = (exercises: ExerciseProps[]) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    try {
      const response = await userLogService.addExerciseLog(exercises);

      const result = response.data;

      if (result.exercises.length) {
        dispatch({
          type: userLogActionTypes.ADD_USER_EXERCISES_LOG,
          exercises: result.exercises,
        });
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.exercise === 'push' && Platform.OS === 'ios') {
          const oldExercises = useState().userLog.exercises;
          const db = useState().base.db;
          syncExercise(db, oldExercises.concat(result.exercises));
        }
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};
export const updateExistExercisesToLog = (exercises: ExerciseProps[]) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    try {
      const response = await userLogService.updateExerciseLog(exercises);

      const result = response.data;

      if (result.exercises.length) {
        dispatch({
          type: userLogActionTypes.UPDATE_USER_EXERCISES_LOG,
          exercises: result.exercises,
        });
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.exercise === 'push' && Platform.OS === 'ios') {
          const oldExercises = useState().userLog.exercises;
          const newExercises = oldExercises.map((item: ExerciseProps) => {
            if (item.id === result.exercises[0].id) {
              return result.exercises[0];
            } else {
              return item;
            }
          });
          const db = useState().base.db;
          syncExercise(db, newExercises);
        }
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const addExerciseToLog = (query: string) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    const selectedDate = useState().userLog.selectedDate;

    const userDate = useState().auth.userData;

    const userAge = new Date().getFullYear() - userDate.birth_year;
    const user_data = {
      age: (userAge > 100 ? 30 : userAge) || null,
      height_cm: userDate.height_cm || null,
      weight_kg: userDate.weight_kg || null,
      gender: userDate.gender || null,
      query,
    };

    try {
      const checkResponse = await userLogService.getExerciseByQuery(user_data);

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

        if (result.exercises.length) {
          dispatch({
            type: userLogActionTypes.ADD_USER_EXERCISES_LOG,
            exercises: result.exercises,
          });
          dispatch(refreshUserLogTotals());
        } else {
          dispatch(
            setInfoMessage({
              title: 'Could not determine any exercises to log.',
              btnText: 'Ok',
            }),
          );
        }
      }
    } catch (error) {
      dispatch(
        setInfoMessage({
          title: 'Could not determine any exercises to log.',
          btnText: 'Ok',
        }),
      );
      throw error;
    }
  };
};

export const updateExerciseToLog = (query: string, exercise: ExerciseProps) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    const selectedDate = useState().userLog.selectedDate;
    const userDate = useState().auth.userData;

    const userAge = new Date().getFullYear() - userDate.birth_year;
    const user_data = {
      age: (userAge > 100 ? 30 : userAge) || null,
      height_cm: userDate.height_cm || null,
      weight_kg: userDate.weight_kg || null,
      gender: userDate.gender || null,
      query,
    };
    try {
      const checkResponse = await userLogService.getExerciseByQuery(user_data);

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

        if (result.exercises.length) {
          dispatch({
            type: userLogActionTypes.UPDATE_USER_EXERCISES_LOG,
            exercises: result.exercises,
          });
          dispatch(refreshUserLogTotals());
        }
      }
    } catch (error) {
      throw error;
    }
  };
};

export const addFoodToLog = (
  foodArray: Array<FoodProps>,
  loggingOptions: Partial<loggingOptionsProps>,
) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
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

    foodArray.map((food: FoodProps) => {
      food.consumed_at =
        moment(loggingOptions.consumed_at).format('YYYY-MM-DDTHH:mm:ss') +
        moment.tz(timezone).format('Z');
      food.meal_type = mealType;

      delete food.uuid;
      delete food.public_id;
    });

    try {
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
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const updateFoodFromlog = (foodArray: Array<FoodProps>) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await userLogService.updateFoodFromLog(foodArray);

      const result = response.data;

      if (result.foods?.length) {
        dispatch({
          type: userLogActionTypes.UPDATE_FOOD_FROM_LOG,
          payload: result.foods[0],
        });
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const deleteFoodFromLog = (foodIds: Array<{id: string}>) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await userLogService.deleteFoodFromLog(foodIds);

      if (response.status === 200) {
        dispatch({
          type: userLogActionTypes.DELETE_FOOD_FROM_LOG,
          foodIds: foodIds.map(item => item.id),
        });
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
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

    try {
      const response = await userLogService.setDayNotes(data);

      const totals = response.data;

      if (totals.dates) {
        dispatch({
          type: userLogActionTypes.SET_DAY_NOTES,
          totals: totals.dates || [],
        });
      }
    } catch (error) {
      throw error;
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

export const addWaterlog = (water: Array<WaterLogProps>) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await userLogService.addWaterLog(water);

      const result = response.data;

      if (result.logs?.length) {
        dispatch({
          type: userLogActionTypes.UPDATE_WATER_LOG,
          payload: result.logs[0].consumed,
        });
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const updateWaterlog = (water: Array<WaterLogProps>) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await userLogService.updateWaterLog(water);

      const result = response.data;

      if (result.logs?.length) {
        dispatch({
          type: userLogActionTypes.UPDATE_WATER_LOG,
          payload: result.logs[0].consumed,
        });
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const deleteWaterFromLog = () => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    const selectedDate = useState().userLog.selectedDate;
    try {
      const response = await userLogService.deleteWaterFromLog([
        {date: selectedDate},
      ]);

      if (response.status === 200) {
        dispatch({
          type: userLogActionTypes.DELETE_WATER_FROM_LOG,
        });
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const refreshLog = (selectedDate: string, timezone: string) => {
  return async (dispatch: Dispatch<any>) => {
    const logBeginDate = timeHelper.offsetDays(selectedDate, 'YYYY-MM-DD', -7);
    const logEndDate = timeHelper.offsetDays(selectedDate, 'YYYY-MM-DD', 7);
    batch(() => {
      dispatch(getUserFoodlog(logBeginDate, logEndDate, 0));
      dispatch(getUserWeightlog(logBeginDate, logEndDate, 0));
      dispatch(getUserExerciseslog(logBeginDate, logEndDate, 0));
      dispatch(getDayTotals(logBeginDate, logEndDate, timezone));
    });
  };
};

export const uploadImage = async (entity: string, id: string, data: Asset) => {
  const formData = new FormData();
  console.log('upload image', data);
  formData.append('file', {
    name: data.fileName,
    type: data.type,
    uri: data.uri,
  });
  try {
    const response = await baseService.uploadImage(entity, id, formData);
    console.log('response upload image', response);
    return response.data;
  } catch (error) {
    throw new Error('Image upload failed: Uploaded file type is not supported');
  }
};
