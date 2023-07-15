import {filterFoodToLabel} from './foodToLabelFilter';

export function createFoodLabelData(
  food: any,
  attributes: Record<string, any>,
) {
  const labelData = filterFoodToLabel(food, attributes);
  return labelData;
}
