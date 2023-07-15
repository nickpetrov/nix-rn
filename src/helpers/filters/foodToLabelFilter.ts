import {filterNutrient} from './filterNutrients';
import _ from 'lodash';

const nutritionLabelGlobalOptions: any = {
  adjustUserDailyValues:true,
  allowFDARounding:false,
  applyMathRounding:true,
  calorieIntake: 2000,
  dailyValueCarb:275,
  dailyValueFiber:28,
  dailyValueSodium:2300,
  dailyValueTotalFat:78,
  hideModeSwitcher:true,
  legacyVersion:2,
  // overrides:{},
  showLegacyVersion:false,
  useBaseValueFor2018LabelAndNotDVPercentage:true
};

const defaults = {
  itemName:                 'Item',
  brandName:                'Nutritionix',
  allowFDARounding:         true,
  applyMathRounding:        true,
  valueServingUnitQuantity: 1,
  valueServingSizeUnit:     'Serving',
  showIngredients:          false
};

const map = [
  { labelAttribute: 'valueCalories', attrId: 208 },
  { labelAttribute: 'valueTotalFat', attrId: 204 },
  { labelAttribute: 'valueSatFat', attrId: 606 },
  { labelAttribute: 'valueTransFat', attrId: 605 },
  { labelAttribute: 'valueMonoFat', attrId: 645 },
  { labelAttribute: 'valuePolyFat', attrId: 646 },
  { labelAttribute: 'valueCholesterol', attrId: 601 },
  { labelAttribute: 'valueSodium', attrId: 307 },
  { labelAttribute: 'valuePotassium', attrId: 306 },
  { labelAttribute: 'valuePotassium_2018', attrId: 306 },
  { labelAttribute: 'valueTotalCarb', attrId: 205 },
  { labelAttribute: 'valueFibers', attrId: 291 },
  { labelAttribute: 'valueSugars', attrId: 269 },
  { labelAttribute: 'valueAddedSugars', attrId: 539 },
  { labelAttribute: 'valueProteins', attrId: 203 },
  { labelAttribute: 'valueVitaminA', attrId: 318 },
  { labelAttribute: 'valueVitaminC', attrId: 401 },
  { labelAttribute: 'valueVitaminD', attrId: 328 },
  { labelAttribute: 'valueCalcium', attrId: 301 },
  { labelAttribute: 'valueIron', attrId: 303 },
  { labelAttribute: 'valueCaffeine', attrId: 262 },
];

export const filterFoodToLabel = (
  food: any,
  attributes: Record<string, any>,
  externalServingQty: number = 1,
) => {
  if (!+externalServingQty) {
    externalServingQty = 1;
  }

  const labelData: any = {
    full_nutrients: _.cloneDeep(food.full_nutrients)
  };

  _.forEach(labelData.full_nutrients, (nutrient) => {
    nutrient.value /= externalServingQty;
  });

  labelData.itemName  = (food.food_name || '').replace(/^([a-z])|\s+([a-z])/g, ($1: string) => $1.toUpperCase());
  labelData.brandName = food.brand_name;

  labelData.valueServingUnitQuantity = food.serving_qty;
  labelData.valueServingSizeUnit     = food.serving_unit;
  labelData.valueServingWeightGrams  = food.serving_weight_grams / externalServingQty;

  map.forEach(definition => {
    let value = filterNutrient(food.full_nutrients, definition.attrId, 'value');

    if (!_.isUndefined(value) && value !== null) {
      labelData[definition.labelAttribute] = value / externalServingQty;

      labelData[definition.labelAttribute.replace('value', 'show')] = true;
    } else {
      labelData[definition.labelAttribute.replace('value', 'show')] = false;
    }
  });

  _.extend(labelData, attributes);
  _.extend(labelData, nutritionLabelGlobalOptions);

  _.forEach(defaults, (value, key) => {
    if (_.isUndefined(labelData[key]) && _.isUndefined(nutritionLabelGlobalOptions[key])) {
      labelData[key] = value;
    }
  });

  return labelData;
};
