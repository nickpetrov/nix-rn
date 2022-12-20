import {Dispatch} from 'redux';
import connectedAppsService from 'api/connectedAppsService';
import {
  connectedAppsActionTypes,
  fitbitSignInAction,
  fitbitUnlinkAction,
  hkSyncOptionsProps,
  mergeHKSyncOptionsAction,
} from './connectedApps.types';
import appleHealthKit, {
  HKQuantityTypeIdentifier,
  UnitOfEnergy,
  HKQuantitySample,
  UnitOfMass,
} from 'hk';
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
  return async (dispatch: Dispatch<fitbitSignInAction>) => {
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
  return async (dispatch: Dispatch<fitbitUnlinkAction>) => {
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
  return async (dispatch: Dispatch<mergeHKSyncOptionsAction>) => {
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
      unit: 'kg' as UnitOfMass,
    };
    appleHealthKit
      .queryQuantitySamples(HKQuantityTypeIdentifier.bodyMass, options)
      .then(results => {
        console.log('queryQuantitySamples results bodyMass', results);
        const weightsFromHK = results.map((item: HKQuantitySample) => ({
          ...item,
          value: item.quantity,
        }));
        const weightsLog = useState().userLog.weights;
        let api_timestamps: Array<string> = [];
        _.forEach(weightsLog, function (weightObj) {
          api_timestamps.push(moment.utc(weightObj.timestamp).format());
        });
        const hk_weights_to_add: Array<Omit<WeightProps, 'id'>> = [];
        _.forEach(weightsFromHK, function (hkObj) {
          if (
            api_timestamps.indexOf(moment.utc(hkObj.startDate).format()) === -1
          ) {
            hk_weights_to_add.push({
              kg: hkObj.value,
              timestamp: hkObj.startDate.toISOString() as string,
            });
          }
        });
        console.log('weight add', hk_weights_to_add);
        dispatch(addWeightlog(hk_weights_to_add));
      })
      .catch(() => {
        return;
      });
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
      let add_data = {} as ExerciseProps;
      let ts;
      const exercisesByDay = exerciseLog.filter(item => item.timestamp === day);
      if (exercisesByDay && exercisesByDay && exercisesByDay.length === 0) {
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
        if (exercisesByDay) {
          let found = false;
          _.forEach(exercisesByDay, function (ex) {
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
      from: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      to: new Date(), // now
      unit: UnitOfEnergy.Kilocalories,
    };
    appleHealthKit
      .queryQuantitySamples(
        HKQuantityTypeIdentifier.activeEnergyBurned,
        options,
      )
      .then(results => {
        let add_update_map: Record<string, number> = {};
        _.forEach(results, function (record) {
          const day_formatted = moment(record.startDate).format(
            'ddd, MM/DD/YY',
          );
          if (day_formatted in add_update_map) {
            add_update_map[day_formatted] += record.quantity;
          } else {
            if (record.quantity !== 0) {
              add_update_map[day_formatted] = record.quantity;
            }
          }
        });

        dispatch(addOrUpdateHKExercise(add_update_map));
      })
      .catch(() => {
        return;
      });
  };
};
