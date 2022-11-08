import {Dispatch} from 'redux';
import connectedAppsService from 'api/connectedAppsService';
import {
  connectedAppsActionTypes,
  hkSyncOptionsProps,
} from './connectedApps.types';
import appleHealthKit, {
  HealthUnit,
  HealthValueOptions,
} from 'react-native-health';
import moment from 'moment-timezone';
import _ from 'lodash';
import {RootState} from '../index';
import {WeightProps, ExerciseProps} from 'store/userLog/userLog.types';
import {
  addExistExercisesToLog,
  addWeightlog,
  updateExistExercisesToLog,
} from 'store/userLog/userLog.actions';

export const fitbitSign = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await connectedAppsService.fitbitSign();

      const result = response.data;
      if (__DEV__) {
        console.log('fitbitSign', result.state);
      }
      if (result.state) {
        dispatch({
          type: connectedAppsActionTypes.FITBIT_SIGN,
          payload: result.state,
        });
        return result.state;
      }
    } catch (err: any) {
      throw err;
    }
  };
};

export const fitbitUnlink = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await connectedAppsService.fitbitUnlink();

      if (__DEV__) {
        console.log('fitbitUnlink', response);
      }
      if (response.status === 200) {
        dispatch({
          type: connectedAppsActionTypes.FITBIT_UNLINK,
        });
      }
    } catch (err) {
      throw err;
    }
  };
};

export const mergeHKSyncOptions = (options: Partial<hkSyncOptionsProps>) => {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: connectedAppsActionTypes.MERGE_HK_SYNC_OPTIONS,
      payload: options,
    });
  };
};

export const pullWeightsFromHK = () => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    const options = {
      startDate: new Date(
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
      ).toDateString(), // 7 days ago
      endDate: new Date().toDateString(), // now
      unit: 'gram' as HealthUnit,
    };
    appleHealthKit.getWeightSamples(
      options,
      (err: Object, results: Array<HealthValueOptions>) => {
        if (err) {
          return;
        } else {
          const weightsFromHK = results.map((item: HealthValueOptions) => ({
            ...item,
            value: item.value / 1000,
          }));
          const weightsLog = useState().userLog.weights;
          let api_timestamps: Array<string> = [];
          _.forEach(weightsLog, function (day) {
            _.forEach(day.weights, function (weightObj) {
              api_timestamps.push(moment.utc(weightObj.timestamp).format());
            });
          });
          const hk_weights_to_add: Array<Omit<WeightProps, 'id'>> = [];
          _.forEach(weightsFromHK, function (hkObj) {
            if (
              api_timestamps.indexOf(moment.utc(hkObj.startDate).format()) ===
              -1
            ) {
              hk_weights_to_add.push({
                kg: hkObj.value,
                timestamp: hkObj.startDate as string,
              });
            }
          });
          console.log('weight add', hk_weights_to_add);
          dispatch(addWeightlog(hk_weights_to_add));
        }
      },
    );
  };
};

export const addOrUpdateHKExercise = (
  add_update_map: Record<string, number>,
) => {
  return async (dispatch: Dispatch<any>, useState: () => RootState) => {
    const exerciseLog = useState().userLog.exercises;
    let add_arr: ExerciseProps[] = [];
    let update_arr: ExerciseProps[] = [];
    _.forEach(Object.keys(add_update_map), function (day) {
      var add_data = {} as ExerciseProps;
      var ts;
      if (
        exerciseLog &&
        exerciseLog[day] &&
        exerciseLog[day].exercises.length === 0
      ) {
        ts = moment(day, 'ddd, MM/DD/YY').format();
        add_data = {
          tag_id: 939,
          nf_calories: add_update_map[day],
          user_input: 'HealthKit Exercise Total',
          name: 'HealthKit Exercise Total',
          timestamp: ts,
          duration_min: 0,
          met: 0,
        } as ExerciseProps;
        add_arr.push(add_data);
      } else {
        if (exerciseLog && exerciseLog[day]) {
          let found = false;
          _.forEach(exerciseLog[day].exercises, function (ex) {
            // log already has HK, so update
            if (ex.name === 'HealthKit Exercise Total') {
              found = true;
              if (add_update_map[day] !== ex.nf_calories) {
                const update_data = {
                  id: ex.id,
                  nf_calories: add_update_map[day],
                } as ExerciseProps;
                update_arr.push(update_data);
              }
              return;
            }
          });

          if (!found) {
            ts = moment(day, 'ddd, MM/DD/YY').format();
            add_data = {
              tag_id: 939,
              nf_calories: add_update_map[day],
              user_input: 'HealthKit Exercise Total',
              name: 'HealthKit Exercise Total',
              timestamp: ts,
              duration_min: 0,
              met: 0,
            } as ExerciseProps;
            add_arr.push(add_data);
          }
        }
      }
    });

    console.log('ex add', add_arr);
    console.log('ex update', update_arr);
    //do the adds first

    if (add_arr.length) {
      //then add
      dispatch(addExistExercisesToLog(add_arr));
    }

    if (update_arr.length) {
      //then the updates
      dispatch(updateExistExercisesToLog(update_arr));
    }
  };
};

export const pullExerciseFromHK = () => {
  return async (dispatch: Dispatch<any>) => {
    const options = {
      startDate: new Date(
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
      ).toDateString(), // 7 days ago
      endDate: new Date().toDateString(), // now
      unit: 'kilocalorie' as HealthUnit,
    };
    appleHealthKit.getActiveEnergyBurned(
      options,
      (err: Object, results: Array<HealthValueOptions>) => {
        if (err) {
          return;
        } else {
          let add_update_map: Record<string, number> = {};
          _.forEach(results, function (record) {
            const day_formatted = moment(record.startDate).format(
              'ddd, MM/DD/YY',
            );
            if (day_formatted in add_update_map) {
              add_update_map[day_formatted] += record.value;
            } else {
              if (record.value !== 0) {
                add_update_map[day_formatted] = record.value;
              }
            }
          });

          dispatch(addOrUpdateHKExercise(add_update_map));
        }
      },
    );
  };
};
