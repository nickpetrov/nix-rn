import _ from 'lodash';
import {FoodProps} from 'store/userLog/userLog.types';

export const addGramsToAltMeasures = (foodObj: FoodProps) => {
  if (!foodObj.serving_weight_grams) {
    return foodObj;
  }
  var cloneFoodObj = _.cloneDeep(foodObj),
    gMeasure;
  // Check if the alt_measures present
  if (cloneFoodObj.alt_measures) {
    // Check if the 'grams' present in alt_measures
    gMeasure = _.find(cloneFoodObj.alt_measures, {measure: 'g'});
  } else {
    cloneFoodObj.alt_measures = [];
    var temp = {
      serving_weight: cloneFoodObj.serving_weight_grams,
      seq: null,
      measure: cloneFoodObj.serving_unit,
      qty: cloneFoodObj.serving_qty,
    };
    cloneFoodObj.alt_measures.unshift(temp);
    gMeasure = false;
  }

  if (!gMeasure && cloneFoodObj.serving_weight_grams) {
    cloneFoodObj.alt_measures.push({
      measure: 'g',
      qty: 1,
      seq: 104,
      serving_weight: 1,
    });
  }

  return cloneFoodObj;
};
