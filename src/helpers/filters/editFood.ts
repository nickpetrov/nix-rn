import {filterNutrient} from './filterNutrients';
import {filterFoodToLabel} from './foodToLabelFilter';

export function createFoodLabelData(food: any) {
  const labelData = filterFoodToLabel(food, {
    showAmountPerServing: false,
    showItemName: false,
    showServingUnitQuantity: false,
    showServingUnitQuantityTextbox: false,
    showTransFat: false,
    valuePhosphorus: filterNutrient(food.full_nutrients, 305, 'value'),
    vitamin_d: filterNutrient(food.full_nutrients, 324, 'value'),
  });
  return labelData[0];
}
