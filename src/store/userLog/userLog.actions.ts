// utils
import moment from 'moment-timezone';
import {batch} from 'react-redux';
import {Platform} from 'react-native';

//helpers
import {
  calculateConsumedTimestamp,
  guessMealTypeByTime,
} from 'helpers/foodLogHelpers';
import * as timeHelper from 'helpers/time.helpers';
import healthkitSync from 'helpers/healthkit/healthkitSync';
import syncWeight from 'helpers/healthkit/HealthKitWeightSync';
import syncExercise from 'helpers/healthkit/HealthKitExerciseSync';

// services
import userLogService from 'api/userLogService';
import baseService from 'api/baseService';

// actions
import {setInfoMessage} from '../base/base.actions';
import {
  pullExerciseFromHK,
  pullWeightsFromHK,
} from 'store/connectedApps/connectedApps.actions';

// types
import {
  ExerciseProps,
  FoodProps,
  loggingOptionsProps,
  userLogActionTypes,
  WeightProps,
  WaterLogProps,
  getUserFoodLogAction,
  getDayTotalsUserLogAction,
  addFoodToLogAction,
  updateFoodFromLogAction,
  changeSelectedDateAction,
  updateDayTotalsAction,
  deleteFoodFromLogAction,
  deleteExerciseFromLogAction,
  getUserWeightsLogAction,
  addWeightToLogAction,
  updateWeightsLogAction,
  updateWaterLogAction,
  deleteWaterFromLogAction,
  getUserExerciseLogAction,
  addUserExerciseLogAction,
  updateUserExerciseLogAction,
} from './userLog.types';
import {Dispatch} from 'redux';
import {RootState} from '../index';
import {Asset} from 'react-native-image-picker';

export const getDayTotals = (
  beginDate: string,
  endDate: string,
  timezone: string,
) => {
  return async (dispatch: Dispatch<getDayTotalsUserLogAction>) => {
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
      console.log('error getDayTotals', error);
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
  return async (
    dispatch: Dispatch<getUserFoodLogAction | getDayTotalsUserLogAction>,
    useState: () => RootState,
  ) => {
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
      // const beginDateSelected = useState().userLog.selectedDate;
      const hkSyncOptions = useState().connectedApps.hkSyncOptions;
      if (hkSyncOptions.nutrition === 'push' && Platform.OS === 'ios') {
        const db = useState().base.db;
        healthkitSync(userFoodlog.foods, db);
      }

      // dispatch<any>(getDayTotals(beginDateSelected, endDate, timezone));
    } catch (error) {
      console.log('error getUserFoodlog', error);
    }
  };
};

export const getUserWeightlog = (
  begin: string,
  endDate: string,
  offset: number | undefined,
) => {
  return async (
    dispatch: Dispatch<getUserWeightsLogAction>,
    useState: () => RootState,
  ) => {
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
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.weight === 'push' && Platform.OS === 'ios') {
          const db = useState().base.db;
          syncWeight(db, result.weights);
        }
        dispatch({
          type: userLogActionTypes.GET_USER_WEIGHT_LOG,
          weights: result.weights,
        });
        if (hkSyncOptions.weight === 'pull' && Platform.OS === 'ios') {
          dispatch<any>(pullWeightsFromHK());
        }
      }
    } catch (error) {
      console.log('error getUserWeightlog', error);
    }
  };
};

export const addWeightlog = (weights: Array<Partial<WeightProps>>) => {
  return async (
    dispatch: Dispatch<addWeightToLogAction>,
    useState: () => RootState,
  ) => {
    try {
      const response = await userLogService.addWeightlog(weights);

      const result = response.data;

      if (result.weights) {
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.weight === 'push' && Platform.OS === 'ios') {
          const oldWeights = useState().userLog.weights;
          const db = useState().base.db;
          syncWeight(db, oldWeights.concat(result.weights));
        }
        dispatch({
          type: userLogActionTypes.ADD_WEIGHT_LOG,
          weights: result.weights,
        });
        dispatch<any>(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const updateWeightlog = (weights: Array<WeightProps>) => {
  return async (
    dispatch: Dispatch<updateWeightsLogAction>,
    useState: () => RootState,
  ) => {
    try {
      const response = await userLogService.updateWeightlog(weights);

      const result = response.data;

      if (result.weights) {
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
        dispatch({
          type: userLogActionTypes.UPDATE_WEIGHT_LOG,
          weights: result.weights,
        });
        dispatch<any>(refreshUserLogTotals());
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
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.weight === 'push' && Platform.OS === 'ios') {
          const oldWeights = useState().userLog.weights;
          const db = useState().base.db;
          syncWeight(
            db,
            oldWeights.filter(item => !deletedIds.includes(item.id)),
          );
        }
        dispatch({
          type: userLogActionTypes.DELETE_WEIGHT_FROM_LOG,
          weights: weights.map(item => item.id),
        });
        dispatch(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};
export const deleteExerciseFromLog = (exercises: Array<{id: string}>) => {
  return async (
    dispatch: Dispatch<deleteExerciseFromLogAction>,
    useState: () => RootState,
  ) => {
    try {
      const response = await userLogService.deleteExerciseFromLog(exercises);

      if (response.status === 200) {
        const deletedExercisesIds = exercises.map(item => item.id);
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.exercise === 'push' && Platform.OS === 'ios') {
          const oldExercises = useState().userLog.exercises;
          const db = useState().base.db;
          syncExercise(
            db,
            oldExercises.filter(item => !deletedExercisesIds.includes(item.id)),
          );
        }
        dispatch({
          type: userLogActionTypes.DELETE_EXERCISE_FROM_LOG,
          exercises: deletedExercisesIds,
        });
        dispatch<any>(refreshUserLogTotals());
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
  return async (
    dispatch: Dispatch<getUserExerciseLogAction>,
    useState: () => RootState,
  ) => {
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
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.exercise === 'push' && Platform.OS === 'ios') {
          const db = useState().base.db;
          syncExercise(db, result.exercises);
        }
        dispatch({
          type: userLogActionTypes.GET_USER_EXERCISES_LOG,
          exercises: result.exercises,
        });
        if (hkSyncOptions.exercise === 'pull' && Platform.OS === 'ios') {
          dispatch<any>(pullExerciseFromHK());
        }
      }
    } catch (error) {
      console.log('error getUserExerciseslog', error);
    }
  };
};

export const addExistExercisesToLog = (exercises: ExerciseProps[]) => {
  return async (
    dispatch: Dispatch<addUserExerciseLogAction>,
    useState: () => RootState,
  ) => {
    try {
      const response = await userLogService.addExerciseLog(exercises);

      const result = response.data;

      if (result.exercises.length) {
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.exercise === 'push' && Platform.OS === 'ios') {
          const oldExercises = useState().userLog.exercises;
          const db = useState().base.db;
          syncExercise(db, oldExercises.concat(result.exercises));
        }
        dispatch<any>(refreshUserLogTotals());
        dispatch({
          type: userLogActionTypes.ADD_USER_EXERCISES_LOG,
          exercises: result.exercises,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};
export const updateExistExercisesToLog = (exercises: ExerciseProps[]) => {
  return async (
    dispatch: Dispatch<updateUserExerciseLogAction>,
    useState: () => RootState,
  ) => {
    try {
      const response = await userLogService.updateExerciseLog(exercises);

      const result = response.data;

      if (result.exercises.length) {
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
        dispatch({
          type: userLogActionTypes.UPDATE_USER_EXERCISES_LOG,
          exercises: result.exercises,
        });
        dispatch<any>(refreshUserLogTotals());
      }
    } catch (error) {
      console.log(error);
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
              .minutes(moment().minutes())
              .format(),
          },
        ]);

        const result = response.data;

        if (result.exercises.length) {
          const hkSyncOptions = useState().connectedApps.hkSyncOptions;
          if (hkSyncOptions.exercise === 'push' && Platform.OS === 'ios') {
            const oldExercises = useState().userLog.exercises;
            const db = useState().base.db;
            syncExercise(db, oldExercises.concat(result.exercises));
          }
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
  return async (
    dispatch: Dispatch<addFoodToLogAction>,
    useState: () => RootState,
  ) => {
    const timezone = useState().auth.userData.timezone;

    const mealType =
      loggingOptions.meal_type ||
      guessMealTypeByTime(moment(loggingOptions.consumed_at).hour());

    const consumed_at = calculateConsumedTimestamp(
      mealType,
      loggingOptions.consumed_at,
    );

    loggingOptions.consumed_at = consumed_at + moment.tz(timezone).format('Z');

    foodArray.forEach((food: FoodProps) => {
      food.consumed_at = consumed_at + moment.tz(timezone).format('Z');
      food.meal_type = mealType;

      delete food.uuid;
      delete food.public_id;
      if (food._hiddenQuery !== undefined) {
        delete food._hiddenQuery;
      }
    });

    try {
      const response = await userLogService.addFoodToLog(
        foodArray,
        loggingOptions,
      );

      const result = response.data;

      if (result.foods) {
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.nutrition === 'push' && Platform.OS === 'ios') {
          const db = useState().base.db;
          const oldFoods = useState().userLog.foods;
          const foodToAdd = !Array.isArray(result.foods)
            ? [result.foods]
            : result.foods;
          healthkitSync(oldFoods.concat(foodToAdd), db);
        }
        dispatch({
          type: userLogActionTypes.ADD_FOOD_TO_LOG,
          payload: result.foods,
        });
        dispatch<any>(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const updateFoodFromlog = (foodArray: Array<FoodProps>) => {
  return async (
    dispatch: Dispatch<updateFoodFromLogAction>,
    useState: () => RootState,
  ) => {
    try {
      const response = await userLogService.updateFoodFromLog(foodArray);

      const result = response.data;

      if (result.foods?.length) {
        const hkSyncOptions = useState().connectedApps.hkSyncOptions;
        if (hkSyncOptions.nutrition === 'push' && Platform.OS === 'ios') {
          const db = useState().base.db;
          const oldFoods = useState().userLog.foods;
          const newFoods = [...oldFoods];
          const changedFoodIndex = newFoods.findIndex(
            item => item.id === result.foods[0].id,
          );
          if (changedFoodIndex !== -1) {
            newFoods[changedFoodIndex] = result.foods[0];
          }
          healthkitSync(newFoods, db);
        }
        dispatch({
          type: userLogActionTypes.UPDATE_FOOD_FROM_LOG,
          payload: result.foods[0],
        });
        dispatch<any>(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const deleteFoodFromLog = (foodIds: Array<{id: string}>) => {
  return async (dispatch: Dispatch<deleteFoodFromLogAction>) => {
    try {
      const response = await userLogService.deleteFoodFromLog(foodIds);

      if (response.status === 200) {
        dispatch({
          type: userLogActionTypes.DELETE_FOOD_FROM_LOG,
          foodIds: foodIds.map(item => item.id),
        });
        dispatch<any>(refreshUserLogTotals());
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const setDayNotes = (targetDate: string, newNotes: string) => {
  return async (dispatch: Dispatch<updateDayTotalsAction>) => {
    const data = {
      dates: [
        {
          date: targetDate,
          notes: newNotes ? newNotes : null,
        },
      ],
    };

    try {
      const response = await userLogService.updateDayTotals(data);

      const totals = response.data;

      if (totals.dates) {
        dispatch({
          type: userLogActionTypes.UPDATE_DAY_TOTALS,
          totals: totals.dates || [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const setDayCalorieLimit = (
  targetDate: string,
  daily_kcal_limit: number | null,
) => {
  return async (dispatch: Dispatch<updateDayTotalsAction>) => {
    const data = {
      dates: [
        {
          date: targetDate,
          daily_kcal_limit: daily_kcal_limit || 0,
        },
      ],
    };

    try {
      const response = await userLogService.updateDayTotals(data);

      const totals = response.data;

      if (totals.dates) {
        dispatch({
          type: userLogActionTypes.UPDATE_DAY_TOTALS,
          totals: totals.dates || [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const changeSelectedDay = (newDate: string) => {
  return async (dispatch: Dispatch<changeSelectedDateAction>) => {
    dispatch({
      type: userLogActionTypes.CHANGE_SELECTED_DATE,
      newDate: newDate,
    });
  };
};

export const addWaterlog = (water: Array<WaterLogProps>) => {
  return async (dispatch: Dispatch<updateWaterLogAction>) => {
    try {
      const response = await userLogService.addWaterLog(water);

      const result = response.data;

      if (result.logs?.length) {
        dispatch({
          type: userLogActionTypes.UPDATE_WATER_LOG,
          payload: result.logs[0].consumed,
        });
        dispatch<any>(refreshUserLogTotals());
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
  return async (
    dispatch: Dispatch<deleteWaterFromLogAction>,
    useState: () => RootState,
  ) => {
    const selectedDate = useState().userLog.selectedDate;
    try {
      const response = await userLogService.deleteWaterFromLog([
        {date: selectedDate},
      ]);

      if (response.status === 200) {
        dispatch({
          type: userLogActionTypes.DELETE_WATER_FROM_LOG,
        });
        dispatch<any>(refreshUserLogTotals());
      }
    } catch (error) {
      throw error;
    }
  };
};

export const refreshLog = (
  selectedDate: string,
  timezone: string,
  refresh?: boolean,
) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    const logBeginDate = timeHelper.offsetDays(selectedDate, 'YYYY-MM-DD', -7);
    const logEndDate = timeHelper.offsetDays(selectedDate, 'YYYY-MM-DD', 7);
    const totals = useState().userLog.totals;
    const needUpdateAfterChangeSelectedDate =
      totals.findIndex(
        item => moment(item.date).format('YYYY-MM-DD') === selectedDate,
      ) === -1;
    if (needUpdateAfterChangeSelectedDate || refresh) {
      batch(() => {
        dispatch(getUserFoodlog(logBeginDate, logEndDate, 0));
        dispatch(getUserWeightlog(logBeginDate, logEndDate, 0));
        dispatch(getUserExerciseslog(logBeginDate, logEndDate, 0));
        dispatch(getDayTotals(logBeginDate, logEndDate, timezone));
      });
    } else {
      return;
    }
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
