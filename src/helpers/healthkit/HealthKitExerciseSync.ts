import _ from 'lodash';
import {getLastXDaysDates} from 'helpers/time.helpers';
import Q from 'q';
import {SQLexecute, SQLgetById} from 'helpers/sqlite';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {ExerciseProps} from 'store/userLog/userLog.types';
import moment from 'moment-timezone';
import appleHealthKit, {UnitOfEnergy, HKQuantityTypeIdentifier} from 'hk';

//should always only be one row in table
function getLastExerciseSync(db: SQLiteDatabase | null) {
  const deferred = Q.defer();
  SQLexecute({
    db,
    query: 'SELECT * FROM hkdata_exercise',
    callback: result => {
      if (result.rows.length == 1) {
        const res = SQLgetById(result);
        deferred.resolve({resp: JSON.parse(res.response), id: res.id});
      } else {
        deferred.resolve('');
      }
    },
    errorCallback: err => {
      deferred.reject(err);
    },
  });
  console.log('getLastExerciseSync');
  return deferred.promise;
}

function deleteExerciseFromHK(days: string[]) {
  const promises: any = [];
  _.forEach(days, function (day) {
    const deferred = Q.defer();
    promises.push(deferred.promise);
    const sample = {
      identifier: HKQuantityTypeIdentifier.activeEnergyBurned,
      startDate: moment(day).toDate(),
      endDate: moment(moment(day).endOf('day')).toDate(), //end of day
    };
    console.log('sample', sample);
    appleHealthKit
      .deleteSamples(sample)
      .then(value => {
        console.log('val', value);
        deferred.resolve('success');
      })
      .catch(err => {
        console.log('Delete exercise sample err', err);
        deferred.reject(err);
      });
  });

  return Q.all(promises);
}

function addExerciseToHK(days: string[], exerciseLog: ExerciseProps[]) {
  const promises: any = [];
  _.forEach(days, function (day) {
    _.map(
      exerciseLog.filter(item => item.timestamp == day),
      function (exercise) {
        const deferred = Q.defer();
        promises.push(deferred.promise);
        appleHealthKit
          .saveQuantitySample(
            HKQuantityTypeIdentifier.activeEnergyBurned,
            UnitOfEnergy.Kilocalories,
            exercise.nf_calories,
            {
              start: moment(exercise.timestamp).toDate(),
              end: moment(moment(day).endOf('day')).toDate(),
            },
          )
          .then(() => {
            deferred.resolve('success');
          })
          .catch(err => {
            console.log('add weight sample err', err);
            deferred.reject(err);
          });
      },
    );
  });

  return Q.all(promises);
}

function reconcileHKExercise(
  exercise_data: ExerciseProps[],
  id: string,
  db: SQLiteDatabase | null,
  exerciseLog: ExerciseProps[],
) {
  console.log('exercise_data', exercise_data);
  console.log('exerciseLog', exerciseLog);
  // These are the last 7 days we want to match
  const syncDates = getLastXDaysDates(7);
  let daysToSync: string[] = [];
  const day_difference = _.difference(
    syncDates,
    exercise_data.map(item => item.timestamp),
  );
  _.forEach(day_difference, function (day) {
    daysToSync.push(day);
  });

  _.forEach(exercise_data, function (exercise) {
    //outside the scope of 7 days
    let match_arr;
    if (syncDates.indexOf(exercise.timestamp) === -1) {
      return;
    } else {
      const hkExercises = exercise_data;
      const apiExercises = exerciseLog.filter(
        item => item.timestamp === exercise.timestamp,
      );
      // used to determine deletes. bit arr to store which indices in hk array are matched.
      // ones that are not matched need to be deleted from hk
      match_arr = new Array(hkExercises.length);

      //first check for exercises in api exercises that are not in hk
      _.forEach(apiExercises, function (api_exercise) {
        //index of matched exercise in hkexercises
        const match = _.findIndex(hkExercises, function (exer) {
          return api_exercise.id == exer.id;
        });

        //id no match found, then need to add
        if (match === -1) {
          console.log('adding exercise day', exercise.timestamp);
          daysToSync.push(exercise.timestamp);
          return;
        } else {
          match_arr[match] = 1;
          //check if the exercise has been updated by comparing the calories burned values
          if (api_exercise.nf_calories !== hkExercises[match].nf_calories) {
            console.log('updating exercise', exercise.timestamp);
            daysToSync.push(exercise.timestamp);
            return;
          }
        }
      });
    }

    if (_.includes(daysToSync, exercise.timestamp)) {
      return;
    }

    //iterate through the matched arr to determine deletes
    for (var i = 0; i < match_arr.length; i++) {
      if (!match_arr[i]) {
        console.log('deleting', exercise.timestamp);
        daysToSync.push(exercise.timestamp);
      }
    }
  });

  daysToSync = Array.from(new Set(daysToSync));
  deleteExerciseFromHK(daysToSync).then(function () {
    addExerciseToHK(daysToSync, exerciseLog).then(function () {
      // if we need to do a sync, then update, otherwise its already synced
      if (daysToSync.length) {
        console.log('updating exercise sqlite');
        SQLexecute({
          db,
          query: 'UPDATE hkdata_exercise SET response=? where id=?',
          params: [JSON.stringify(exerciseLog), id],
        });
      }
    });
  });
}

function syncExercise(db: SQLiteDatabase | null, exerciseLog: ExerciseProps[]) {
  const syncDates = getLastXDaysDates(7);
  const exercises = exerciseLog.map(item => ({
    ...item,
    timestamp: moment(item.timestamp).format(),
  }));
  //do not sync days outside the last 7 days
  const should_sync = _.difference(
    exercises.map(item => item.timestamp),
    syncDates,
  ).length;
  if (should_sync == syncDates.length) {
    console.log('dont sync');
    return;
  }

  getLastExerciseSync(db)
    .then(function (result: any) {
      // if result set is empty, push all to hk; else determine what to push
      if (!result) {
        console.log('adding all exercise');

        deleteExerciseFromHK(syncDates).then(function () {
          console.log('Delete all exercise sample success');
          addExerciseToHK(syncDates, exercises).then(function () {
            console.log('updating hk exercise sqlite');
            SQLexecute({
              db,
              query: 'INSERT INTO hkdata_exercise (response) VALUES (?)',
              params: [JSON.stringify(exercises)],
            });
          });
        });
      } else {
        console.log('add result exercise');
        reconcileHKExercise(result.resp, result.id, db, exercises);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

export default syncExercise;
