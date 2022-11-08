import _ from 'lodash';
import {getLastXDaysDates} from 'helpers/time.helpers';
import Q from 'q';
import {SQLexecute, SQLgetById} from 'helpers/sqlite';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import moment from 'moment-timezone';
import appleHealthKit, {
  HealthUnit,
  HealthValueOptions,
} from 'react-native-health';
import {WeightProps} from 'store/userLog/userLog.types';

let unit = 'metric';

//should always only be one row in table
function getLastWeightSync(db: SQLiteDatabase | null) {
  const deferred = Q.defer();
  SQLexecute({
    db,
    query: 'SELECT * FROM hkdata_weight',
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

  return deferred.promise;
}

function addWeightToHK(weights: WeightProps[]) {
  const promises: any = [];
  _.forEach(weights, function (weight) {
    const deferred = Q.defer();
    promises.push(deferred.promise);
    const sample = {
      unit: unit === 'metric' ? ('kg' as HealthUnit) : ('lb' as HealthUnit),
      value: unit === 'metric' ? weight.kg : _.round(weight.kg * 2.20462, 2),
      date: new Date(weight.timestamp),
    } as HealthValueOptions;

    appleHealthKit.saveWeight(sample, err => {
      if (err) {
        console.log('add weight sample err', err);
        deferred.reject(err);
      } else {
        deferred.resolve('success');
      }
    });
  });

  return Q.all(promises);
}

function deleteWeightFromHK(weights: WeightProps[]) {
  const promises: any = [];
  _.forEach(weights, function (weight) {
    const deferred = Q.defer();
    promises.push(deferred.promise);
    const sample = {
      startDate: new Date(new Date(weight.timestamp).getTime() - 1000),
      endDate: new Date(new Date(weight.timestamp).getTime() + 1000),
      sampleType: 'HKQuantityTypeIdentifierBodyMass',
    };
    console.log('sample', sample);
    // window.plugins.healthkit.deleteSamples(
    //   sample,
    //   function (value) {
    //     console.log('val', angular.toJson(value));
    //     deferred.resolve('success');
    //   },
    //   function (err) {
    //     console.log('Delete weight sample err', angular.toJson(err));
    //     deferred.reject(err);
    //   },
    // );
  });

  return Q.all(promises);
}

function reconcileHKWeight(
  weight_data: WeightProps[],
  id: string,
  weightsLog: WeightProps[],
  db: SQLiteDatabase | null,
) {
  // These are the last 7 days we want to match
  const syncDates = getLastXDaysDates(7);
  const addArr: any = [];
  const deleteArr: any = [];
  const updateArr: any = [];
  const day_difference = _.difference(
    syncDates,
    weight_data.map(item => item.timestamp),
  );
  _.forEach(day_difference, function (day) {
    addArr.push.apply(
      addArr,
      weightsLog.filter((item: WeightProps) => item.timestamp === day),
    );
  });

  _.forEach(weight_data, function (weight) {
    //outside the scope of 7 days
    let match_arr;
    let hkWeights: any[];
    if (syncDates.indexOf(weight.timestamp) === -1) {
      return;
    } else {
      hkWeights = weight_data;
      const apiWeights = weightsLog.filter(
        (item: WeightProps) => item.timestamp === weight.timestamp,
      );
      // used to determine deletes. bit arr to store which indices in hk array are matched.
      // ones that are not matched need to be deleted from hk
      match_arr = new Array(hkWeights.length);

      //first check for weights in api weights that are not in hk
      _.forEach(apiWeights, function (api_weight) {
        //index of matched weight in hkweights
        const match = _.findIndex(hkWeights, function (w) {
          return api_weight.id == w.id;
        });

        //id no match found, then need to add
        if (match === -1) {
          console.log('adding weight', api_weight.kg);
          addArr.push(api_weight);
        } else {
          match_arr[match] = 1;
          //check if the weight has been updated by comparing the kg values
          if (api_weight.kg !== hkWeights[match].kg) {
            console.log('updating', api_weight.kg);
            updateArr.push([api_weight, hkWeights[match]]);
          }
        }
      });
    }

    //iterate through the matched arr to determine deletes
    for (var i = 0; i < match_arr.length; i++) {
      if (!match_arr[i]) {
        console.log('deleting', hkWeights[i].kg);
        deleteArr.push(hkWeights[i]);
      }
    }
  });

  deleteWeightFromHK(deleteArr);
  addWeightToHK(addArr);
  // for updated weight
  if (updateArr.length) {
    const weights_to_delete: any = [];
    const weights_to_add: any = [];
    _.map(updateArr, function (weightarr) {
      weights_to_delete.push(weightarr[1]);
      weights_to_add.push(weightarr[0]);
    });

    deleteWeightFromHK(weights_to_delete).then(function () {
      'delete update samples success';
      addWeightToHK(weights_to_add);
    });
  }

  if (deleteArr.length || addArr.length || updateArr.length) {
    console.log('updating hk weight sqlite');
    SQLexecute({
      db,
      query: 'UPDATE hkdata_weight SET response=? where id=?',
      params: [JSON.stringify(weightsLog), id],
    });
  }
}

function syncWeight(
  measure_system: number,
  db: SQLiteDatabase | null,
  weightsLog: WeightProps[],
) {
  const syncDates = getLastXDaysDates(7);
  const weights = weightsLog.map(item => ({
    ...item,
    timestamp: moment(item.timestamp).format('ddd, MM/DD/YY'),
  }));
  // do not sync days outside the last 7 days
  const should_sync = _.difference(
    weights.map(item => item.timestamp),
    syncDates,
  ).length;
  if (should_sync == syncDates.length) {
    console.log('dont sync');
    return;
  }
  unit = measure_system === 1 ? 'metric' : 'imperial';
  getLastWeightSync(db)
    .then(function (result: any) {
      // if result set is empty, push all to hk; else determine what to push
      if (!result) {
        console.log('adding all weight');

        addWeightToHK(weights).then(function () {
          console.log('updating hk weight sqlite');
          SQLexecute({
            db,
            query: 'INSERT INTO hkdata_weight (response) VALUES (?)',
            params: [JSON.stringify(weights)],
          });
        });
      } else {
        reconcileHKWeight(result.resp, result.id, weights, db);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

export default syncWeight;
