import {FoodProps} from 'store/userLog/userLog.types';
import _ from 'lodash';
import {getLastXDaysDates} from 'helpers/time.helpers';
import Q from 'q';
import {SQLexecute, SQLgetById} from 'helpers/sqlite';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import moment from 'moment-timezone';
import appleHealthKit, {
  HKCorrelationTypeIdentifier,
  HKQuantitySampleForSaving,
  HKQuantityTypeIdentifier,
} from 'hk';

const atr_ids: Record<number, string[]> = {
  262: [HKQuantityTypeIdentifier.dietaryCaffeine, 'mg'],
  301: [HKQuantityTypeIdentifier.dietaryCalcium, 'mg'],
  205: [HKQuantityTypeIdentifier.dietaryCarbohydrates, 'g'],
  601: [HKQuantityTypeIdentifier.dietaryCholesterol, 'mg'],
  312: [HKQuantityTypeIdentifier.dietaryCopper, 'mg'],
  208: [HKQuantityTypeIdentifier.dietaryEnergyConsumed, 'kcal'],
  645: [HKQuantityTypeIdentifier.dietaryFatMonounsaturated, 'g'],
  646: [HKQuantityTypeIdentifier.dietaryFatPolyunsaturated, 'g'],
  606: [HKQuantityTypeIdentifier.dietaryFatSaturated, 'g'],
  204: [HKQuantityTypeIdentifier.dietaryFatTotal, 'g'],
  291: [HKQuantityTypeIdentifier.dietaryFiber, 'g'],
  303: [HKQuantityTypeIdentifier.dietaryIron, 'mg'],
  304: [HKQuantityTypeIdentifier.dietaryMagnesium, 'mg'],
  315: [HKQuantityTypeIdentifier.dietaryManganese, 'mg'],
  406: [HKQuantityTypeIdentifier.dietaryNiacin, 'mg'],
  410: [HKQuantityTypeIdentifier.dietaryPantothenicAcid, 'mg'],
  305: [HKQuantityTypeIdentifier.dietaryPhosphorus, 'mg'],
  306: [HKQuantityTypeIdentifier.dietaryPotassium, 'mg'],
  203: [HKQuantityTypeIdentifier.dietaryProtein, 'g'],
  405: [HKQuantityTypeIdentifier.dietaryRiboflavin, 'mg'],
  307: [HKQuantityTypeIdentifier.dietarySodium, 'mg'],
  269: [HKQuantityTypeIdentifier.dietarySugar, 'g'],
  404: [HKQuantityTypeIdentifier.dietaryThiamin, 'mg'],
  415: [HKQuantityTypeIdentifier.dietaryVitaminB6, 'mg'],
  320: [HKQuantityTypeIdentifier.dietaryVitaminA, 'mcg'],
  401: [HKQuantityTypeIdentifier.dietaryVitaminC, 'mg'],
  328: [HKQuantityTypeIdentifier.dietaryVitaminD, 'mcg'],
  323: [HKQuantityTypeIdentifier.dietaryVitaminE, 'mg'],
  309: [HKQuantityTypeIdentifier.dietaryZinc, 'mg'],
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
  let delete_samples: any = [];
  const promises: any = [];
  _.forEach(days, function (day) {
    _.map(atr_ids, function (arr) {
      const sample = {
        startDate: moment(moment(day).startOf("day").valueOf() - 1000).toDate(),
        endDate: moment(moment(day).endOf("day").valueOf() + 1000).toDate(), //end of day
        identifier: arr[0],
      };
      delete_samples.push(sample);
    });
  });
  _.forEach(delete_samples, function (sample) {
    const deferred = Q.defer();
    promises.push(deferred.promise);

    appleHealthKit
      .deleteSamples(sample)
      .then(() => {
        console.log('Delete Sample food', sample);
        deferred.resolve('success');
      })
      .catch(err => {
        console.log('Delete Sample err', err);
        deferred.reject(err);
      });
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
    const sample: HKQuantitySampleForSaving = {
      quantityType: id_dict.hk,
      unit: id_dict.unit,
      quantity: id_dict.value,
      metadata: {
        start: moment().startOf("day").toISOString(),
        end: moment(moment(day).endOf('day')).toISOString(),
      },
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
    const samples = createSample(day, foods);
    if (samples.length === 0) {
      deferred.resolve('success');
      return deferred.promise;
    }
    const correlation = {
      startDate: moment(day).format(), //beginning of day
      endDate: moment(moment(day).endOf('day')).format(), //end of day
      metadata: {day: day},
      correlationType: 'HKCorrelationTypeIdentifierFood',
      samples: samples,
    };
    console.log('correlation', correlation);
    appleHealthKit
      .saveCorrelationSample(HKCorrelationTypeIdentifier.food, samples, {
        start: moment(day).startOf("day").toDate(),
        end: moment(moment(day).endOf('day')).toDate(),
        metadata: {day: day},
      })
      .then(() => {
        console.log('correlation save success!', day);
        deferred.resolve('success');
      })
      .catch(err => {
        console.log('correlation save err', err);
        deferred.reject(err);
      });
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
  const syncDates = getLastXDaysDates(7);
  //do not sync days outside the last 7 days
  const should_sync = _.difference(
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
