import {FoodProps} from 'store/userLog/userLog.types';
import _ from 'lodash';
import {getLastXDaysDates} from 'helpers/time.helpers';
import Q from 'q';
import {SQLexecute, SQLgetById} from 'helpers/sqlite';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import moment from 'moment-timezone';
import appleHealthKit from 'react-native-health';

const atr_ids: Record<number, string[]> = {
  262: [appleHealthKit.Constants.Permissions.Caffeine, 'mg'],
  301: [appleHealthKit.Constants.Permissions.Calcium, 'mg'],
  205: [appleHealthKit.Constants.Permissions.Carbohydrates, 'g'],
  601: [appleHealthKit.Constants.Permissions.Cholesterol, 'mg'],
  312: [appleHealthKit.Constants.Permissions.Copper, 'mg'],
  208: [appleHealthKit.Constants.Permissions.EnergyConsumed, 'kcal'],
  645: [appleHealthKit.Constants.Permissions.FatMonounsaturated, 'g'],
  646: [appleHealthKit.Constants.Permissions.FatPolyunsaturated, 'g'],
  606: [appleHealthKit.Constants.Permissions.FatSaturated, 'g'],
  204: [appleHealthKit.Constants.Permissions.FatTotal, 'g'],
  291: [appleHealthKit.Constants.Permissions.Fiber, 'g'],
  303: [appleHealthKit.Constants.Permissions.Iron, 'mg'],
  304: [appleHealthKit.Constants.Permissions.Magnesium, 'mg'],
  315: [appleHealthKit.Constants.Permissions.Manganese, 'mg'],
  406: [appleHealthKit.Constants.Permissions.Niacin, 'mg'],
  410: [appleHealthKit.Constants.Permissions.PantothenicAcid, 'mg'],
  305: [appleHealthKit.Constants.Permissions.Phosphorus, 'mg'],
  306: [appleHealthKit.Constants.Permissions.Potassium, 'mg'],
  203: [appleHealthKit.Constants.Permissions.Protein, 'g'],
  405: [appleHealthKit.Constants.Permissions.Riboflavin, 'mg'],
  307: [appleHealthKit.Constants.Permissions.Sodium, 'mg'],
  269: [appleHealthKit.Constants.Permissions.Sugar, 'g'],
  404: [appleHealthKit.Constants.Permissions.Thiamin, 'mg'],
  415: [appleHealthKit.Constants.Permissions.VitaminB6, 'mg'],
  320: [appleHealthKit.Constants.Permissions.VitaminA, 'mcg'],
  401: [appleHealthKit.Constants.Permissions.VitaminC, 'mg'],
  328: [appleHealthKit.Constants.Permissions.VitaminD, 'mcg'],
  323: [appleHealthKit.Constants.Permissions.VitaminE, 'mg'],
  309: [appleHealthKit.Constants.Permissions.Zinc, 'mg'],
};

let syncInProgress = false;

// should always only be one row in table
const getLastHKSync = (db: SQLiteDatabase | null) => {
  const deferred = Q.defer();
  SQLexecute({
    db,
    query: 'SELECT * FROM hkdata',
    callback: result => {
      if (result.rows.length == 1) {
        const res = SQLgetById(result);
        deferred.resolve({resp: JSON.parse(res.response), id: res.id});
      } else {
        deferred.resolve('');
      }
    },
    errorCallback: err => {
      console.log('there was error getting hk data from db');
      deferred.reject(err);
    },
  });

  return deferred.promise;
};

function deleteFromHK(days: string[]) {
  var delete_samples: any = [];
  var promises: any = [];
  _.forEach(days, function (day) {
    _.map(atr_ids, function (arr) {
      var sample = {
        startDate: new Date(day).toDateString(),
        endDate: new Date(new Date(day).setHours(23, 59, 59)).toDateString(), //end of day
        sampleType: arr[0],
      };
      delete_samples.push(sample);
    });
  });
  _.forEach(delete_samples, function () {
    var deferred = Q.defer();
    promises.push(deferred.promise);

    // no ability to deleteSamples at this library

    // window.plugins.healthkit.deleteSamples(
    //   sample,
    //   function (value) {
    //     deferred.resolve('success');
    //   },
    //   function (err) {
    //     console.log('Delete Sample err', err);
    //     deferred.reject(err);
    //   },
    // );
  });

  return Q.all(promises);
}

const createSample = (day: string, foods: FoodProps[]) => {
  //object to store samples and aggregate values over all foods for a day
  let sample_dict: any = {};

  //all foods for a day that needs to be updated
  const day_foods = foods.filter(
    item =>
      moment(item.consumed_at).format('YYYY-MM-DD') ===
      moment(day).format('YYYY-MM-DD'),
  );
  _.forEach(day_foods, function (food) {
    _.map(food.full_nutrients, function (nutr_obj) {
      if (atr_ids[nutr_obj.attr_id]) {
        // increment the value
        if (sample_dict[nutr_obj.attr_id]) {
          sample_dict[nutr_obj.attr_id].value += nutr_obj.value;
        } else {
          sample_dict[nutr_obj.attr_id] = {
            hk: atr_ids[nutr_obj.attr_id][0],
            value: nutr_obj.value,
            unit: atr_ids[nutr_obj.attr_id][1],
          };
        }
      }
    });
  });

  // convert sample dict into hksample formatted array
  let hkSample: any = [];
  _.forEach(sample_dict, function (id_dict) {
    const sample = {
      startDate: new Date(day), //beginning of day
      endDate: new Date(new Date(day).setHours(23, 59, 59)), //end of day
      sampleType: id_dict.hk,
      unit: id_dict.unit,
      amount: id_dict.value,
    };
    hkSample.push(sample);
  });

  return hkSample;
};

const addToHK = (days: string[], foods: FoodProps[]) => {
  const promises: any = [];
  if (days.length === 0) {
    const deferred = Q.defer();
    deferred.resolve('success');
    return deferred.promise;
  }

  _.forEach(days, function (day) {
    const deferred = Q.defer();
    promises.push(deferred.promise);
    var samples = createSample(day, foods);
    if (samples.length === 0) {
      deferred.resolve('success');
      return deferred.promise;
    }
    var correlation = {
      startDate: new Date(day), //beginning of day
      endDate: new Date(new Date(day).setHours(23, 59, 59)), //end of day
      metadata: {day: day},
      correlationType: 'HKCorrelationTypeIdentifierFood',
      samples: samples,
    };
    console.log('correlation', correlation);
    // window.plugins.healthkit.saveCorrelation(
    //   correlation,
    //   function (value) {
    //     console.log('correlation save success!', day);
    //     deferred.resolve('success');
    //   },
    //   function (err) {
    //     console.log('correlation save err', angular.toJson(err));
    //     deferred.reject(err);
    //   },
    // );
  });

  return Q.all(promises);
};

const reconcileHK = (
  hk_data: any,
  id: string,
  foods: FoodProps[],
  db: SQLiteDatabase | null,
) => {
  // These are the last 7 days we want to match
  const syncDates = getLastXDaysDates(7);
  let daysToSync: any = [];
  const day_difference = _.difference(syncDates, Object.keys(hk_data));
  _.forEach(day_difference, function (day) {
    daysToSync.push(day);
  });

  _.forEach(hk_data, function (dayObj, day) {
    // outside the scope of the last 7 days
    let match_arr;
    if (syncDates.indexOf(day) === -1) {
      return;
    } else {
      const hkFoods = dayObj.foods;
      const apiFoods = foods.filter(
        item =>
          moment(item.consumed_at).format('YYYY-MM-DD') ===
          moment(day).format('YYYY-MM-DD'),
      );
      // used to determine deletes. bit arr to store which indices in hk array are matched.
      // ones that are not matched need to be deleted from hk
      match_arr = new Array(hkFoods.length);

      // first check for foods in api foods that are not in hk
      _.forEach(apiFoods, function (api_food) {
        //index of matched food in hkfoods
        const match = _.findIndex(hkFoods, function (food: FoodProps) {
          return api_food.id == food.id;
        });

        // matching id was not found, so needs to be added to HK
        if (match === -1) {
          console.log('adding', day);
          daysToSync.push(day);
          return;
        } else {
          match_arr[match] = 1;
          // check if the food has been updated by matching the serving weight grams
          if (
            api_food.serving_weight_grams !==
            hkFoods[match].serving_weight_grams
          ) {
            console.log('updating', day);
            daysToSync.push(day);
            return;
          }
        }
      });
    }

    if (_.includes(daysToSync, day)) {
      return;
    }

    // iterate through the matched arr and "delete" ones that are not matched
    for (var i = 0; i < match_arr.length; i++) {
      if (!match_arr[i]) {
        console.log('delete', day);
        daysToSync.push(day);
      }
    }
  });

  daysToSync = Array.from(new Set(daysToSync));

  deleteFromHK(daysToSync).then(function () {
    addToHK(daysToSync, foods).then(function () {
      // if we need to do a sync, then update, otherwise its already synced
      if (daysToSync.length) {
        console.log('updating sqlite');
        SQLexecute({
          db,
          query: 'UPDATE hkdata SET response=? where id=?',
          params: [JSON.stringify(foods), id],
        });
      }
    });
  });
};

function healthkitSync(foods: FoodProps[], db: SQLiteDatabase | null) {
  if (syncInProgress) {
    return;
  }
  syncInProgress = true;
  var syncDates = getLastXDaysDates(7);
  //do not sync days outside the last 7 days
  var should_sync = _.difference(
    foods.map(item => item.consumed_at),
    syncDates,
  ).length;
  if (should_sync == syncDates.length) {
    console.log('dont sync');
    return;
  }

  getLastHKSync(db)
    .then(function (result: any) {
      // if result set is empty, push all to hk; else determine what to push
      if (!result) {
        console.log('adding all nutrients');

        deleteFromHK(syncDates).then(() => {
          console.log('Delete all samples success');
          addToHK(syncDates, foods).then(() => {
            //update the db with the current foodlog
            console.log('updating hk sqlite');
            SQLexecute({
              db,
              query: 'INSERT INTO hkdata (response) VALUES (?)',
              params: [JSON.stringify(foods)],
            });
          });
        });
      } else {
        reconcileHK(result.resp, result.id, foods, db);
        syncInProgress = false;
      }
    })
    .catch(function (err) {
      console.log(err);
      syncInProgress = false;
    });
}

export default healthkitSync;
