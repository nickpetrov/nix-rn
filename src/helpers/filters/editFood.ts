import {filterFoodToLabel} from './foodToLabelFilter';

export function createFoodLabelData(
  food: any,
  globalOptions: Record<string, any>,
) {
  const labelData = filterFoodToLabel(food, globalOptions);
  return labelData[0];
}
