import _ from 'lodash';
import {getLastXDaysDates} from 'helpers/time.helpers';
import Q from 'q';
import {SQLexecute, SQLgetById} from 'helpers/sqlite';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {ExerciseProps} from 'store/userLog/userLog.types';

//should always only be one row in table
function getLastExerciseSync(db: SQLiteDatabase | null) {
  var deferred = Q.defer();
  SQLexecute({
    db,
    query: 'SELECT * FROM hkdata_exercise',
    callback: result => {
      if (result.rows.length == 1) {
        var res = SQLgetById(result);
        deferred.resolve({resp: JSON.parse(res.response), id: res.id});
      } else {
        deferred.resolve('');
      }
    },
    errorCallback: err => {
      deferred.reject(err);
    },
  });

  return deferred.promise;
}

function deleteExerciseFromHK(days: string[]) {
  const promises: any = [];
  _.forEach(days, function (day) {
    const deferred = Q.defer();
    promises.push(deferred.promise);
    const sample = {
      sampleType: 'HKQuantityTypeIdentifierActiveEnergyBurned',
      startDate: new Date(day),
      endDate: new Date(new Date(day).setHours(23, 59, 59)), //end of day
    };
    console.log(sample);
    // window.plugins.healthkit.deleteSamples(
    //   sample,
    //   function (value) {
    //     deferred.resolve('success');
    //   },
    //   function (err) {
    //     console.log('Delete exercise sample err', angular.toJson(err));
    //     deferred.reject(err);
    //   },
    // );
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
        const sample = {
          sampleType: 'HKQuantityTypeIdentifierActiveEnergyBurned',
          startDate: new Date(exercise.timestamp),
          endDate: new Date(new Date(day).setHours(23, 59, 59)),
          amount: exercise.nf_calories,
          unit: 'kcal',
        };
        console.log('sample', sample);
        //   window.plugins.healthkit.saveQuantitySample(
        //     sample,
        //     function (value) {
        //       deferred.resolve('success');
        //     },
        //     function (err) {
        //       console.log('add exercise sample err', angular.toJson(err));
        //       deferred.reject(err);
        //     },
        //   );
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
  // These are the last 7 days we want to match
  var syncDates = getLastXDaysDates(7);
  var daysToSync: string[] = [];
  var day_difference = _.difference(
    syncDates,
    exercise_data.map(item => item.timestamp),
  );
  _.forEach(day_difference, function (day) {
    daysToSync.push(day);
  });

  _.forEach(exercise_data, function (exercise) {
    //outside the scope of 7 days
    var match_arr;
    if (syncDates.indexOf(exercise.timestamp) === -1) {
      return;
    } else {
      var hkExercises = exercise_data;
      var apiExercises = exerciseLog.filter(
        item => item.timestamp === exercise.timestamp,
      );
      // used to determine deletes. bit arr to store which indices in hk array are matched.
      // ones that are not matched need to be deleted from hk
      match_arr = new Array(hkExercises.length);

      //first check for exercises in api exercises that are not in hk
      _.forEach(apiExercises, function (api_exercise) {
        //index of matched exercise in hkexercises
        var match = _.findIndex(hkExercises, function (exer) {
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
  var syncDates = getLastXDaysDates(7);
  //do not sync days outside the last 7 days
  var should_sync = _.difference(
    exerciseLog.map(item => item.timestamp),
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
          addExerciseToHK(syncDates, exerciseLog).then(function () {
            console.log('updating hk exercise sqlite');
            SQLexecute({
              db,
              query: 'INSERT INTO hkdata_exercise (response) VALUES (?)',
              params: [JSON.stringify(exerciseLog)],
            });
          });
        });
      } else {
        reconcileHKExercise(result.resp, result.id, db, exerciseLog);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

export default syncExercise;
