import _ from 'lodash';

// import {
//   nutrientsMap,
//   fullNutrientsDefinitions,
//   attrMap,
//   baseTrackObj,
//   dailyValueTransforms,
// } from './artifacts';
import {FoodProps} from 'store/userLog/userLog.types';

// /**
//  * @license MIT
//  * @version 2.2.1
//  * @author Yura Fedoriv <yurko.fedoriv@gmail.com>
//  *
//  * @description
//  * Utilities to handle different data formats in Nutritionix APIs
//  */

// const v1TypeAliases = {
//   item_name: ['food_name', 'nix_item_name'],
//   nf_serving_size_qty: ['serving_qty'],
//   nf_serving_size_unit: ['serving_unit'],
//   nf_serving_weight_grams: ['serving_weight_grams'],
//   item_id: ['nix_item_id'],
//   brand_name: ['nix_brand_name', 'brand_name'],
//   brand_id: ['nix_brand_id'],
// };

// function hasItems(test: Array<any>) {
//   return Array.isArray(test) && test.length;
// }

// function optimisticallyMergeArrays(comparator: any, ...cols: any) {
//   let mergeCols = cols.filter(hasItems);
//   //base cases
//   if (!mergeCols.length) return [];
//   if (mergeCols.length === 1) return mergeCols[0];

//   let flat = [].concat(...mergeCols);
//   return _.uniqBy(flat, comparator);
// }

// /**
//  *
//  * @param {object} v1Item Api V1 Food object
//  * @param {object} defaultObj [OPTIONAL] Additional data object that is used as properties source.
//  *                                        Use it to provide default properties.
//  * @returns {object} Track API food object
//  */

// function convertV1ItemToTrackFood(v1Item: any, defaultObj?: any) {
//   v1Item = typeof v1Item === 'object' && v1Item !== null ? v1Item : {};
//   defaultObj =
//     typeof defaultObj === 'object' && defaultObj !== null ? defaultObj : {};

//   //build a full nutrient array from any 'nf' fields from the v1item;
//   let v1FullNutrs = buildFullNutrientsArray(v1Item);

//   //create an object with superset of keys, including both original and aliases fields for later picking.
//   let mappedFields = _.reduce(
//     v1Item,
//     function (accum, val, key) {
//       //either use array of aliases, or the key itself.
//       let aliases = v1TypeAliases[key];
//       if (aliases) {
//         aliases.forEach(alias => (accum[alias] = val));
//       } else {
//         accum[key] = val;
//       }
//       return accum;
//     },
//     {},
//   );

//   //only include truthy fields that are track food object fields. Untruthy fields will be defaulted to the baseTrackObj value.
//   let v1Defaults = _.pickBy(mappedFields, (val, key) => {
//     return baseTrackObj.hasOwnProperty(key) && (val || val === 0);
//   });

//   //join the arrays, taking the defaultObj nutrients first (will be preferred in later uniq testing)
//   let fullNutrArray = optimisticallyMergeArrays(
//     nutr => nutr.attr_id,
//     defaultObj.full_nutrients,
//     v1FullNutrs,
//   );

//   return _.defaults(
//     {full_nutrients: fullNutrArray},
//     defaultObj,
//     v1Defaults,
//     baseTrackObj,
//   );
// }

// /**
//  * Uses top level properties from provided data object to construct full nutrients array.
//  * Supports api names as keys of the source object
//  *
//  * @param {Object} data
//  * @returns {Array} Full nutrients array
//  */
// function buildFullNutrientsArray(data: any) {
//   return _.reduce(
//     nutrientsMap,
//     function (accum: any, nutrDetails: any, v1AttrName: any) {
//       if (data[v1AttrName] || data[v1AttrName] === 0) {
//         let value = parseFloat(data[v1AttrName]);
//         if (!isNaN(value) && !(value < 0)) {
//           let attr_id = nutrDetails.attr_id;
//           //ensure that daily value measures are calculated into the appropriate units.
//           if (dailyValueTransforms[attr_id]) {
//             value = (dailyValueTransforms[attr_id] / 100) * value;
//           }
//           //round to 4 decimal places
//           value = parseFloat(value?.toFixed(4));
//           accum.push({
//             attr_id: nutrDetails.attr_id,
//             value: value,
//           });
//         }
//       }
//       return accum;
//     },
//     [],
//   );
// }

// /**
//  * Generates object with top level nf_attributes from full_nutrients array
//  * @param {Object[]} fullNutrients Full nutrients array
//  * @returns {Object} Nf attributes object
//  */
// function convertFullNutrientsToNfAttributes(fullNutrients: any) {
//   return _.reduce(
//     fullNutrients,
//     function (accum: any, val: any) {
//       var nfKey = attrMap[val.attr_id];
//       if (nfKey) {
//         let transformVal = dailyValueTransforms[val.attr_id];
//         accum[nfKey] = transformVal
//           ? (val.value / transformVal) * 100
//           : val.value;
//       }
//       return accum;
//     },
//     {},
//   );
// }

// /**
//  * Expand short form of full_nutrients items to the full one with name, unit and usda_tag
//  * Mutates original objects
//  *
//  * @param {Object[]} fullNutrients Full nutrients array
//  * @returns {Object[]} Mutated full nutrients array
//  */
// function extendFullNutrientsWithMetaData(fullNutrients: any) {
//   return fullNutrients.map(function (nutr: any) {
//     //found matching nutrient, extend.
//     let nutrDefMatch = fullNutrientsDefinitions[nutr.attr_id];
//     if (nutrDefMatch) {
//       return _.defaults(nutr, nutrDefMatch);
//     } else {
//       return nutr;
//       //no match, return base.
//     }
//   });
// }

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

// export default {
//   nutrientsMap,
//   fullNutrientsDefinitions,
//   attrMap,
//   convertV1ItemToTrackFood,
//   buildFullNutrientsArray,
//   convertFullNutrientsToNfAttributes,
//   extendFullNutrientsWithMetaData,
//   dailyValueTransforms,
//   addGramsToAltMeasures,
// };
