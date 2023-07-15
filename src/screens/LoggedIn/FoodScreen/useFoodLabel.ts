import {useState, useEffect, SetStateAction} from 'react';

import {FoodProps} from 'store/userLog/userLog.types';
import {createFoodLabelData} from 'helpers/filters';
import {filterFoodToLabel} from 'helpers/filters/foodToLabelFilter';
import {filterNutrient, sumFoods} from 'helpers/filters';

const getSingleFoodLabelAttributes = (food: FoodProps) => ({
  showAmountPerServing:           false,
  showItemName:                   false,
  showServingUnitQuantity:        false,
  showServingUnitQuantityTextbox: false,
  showTransFat:                   false,
  valuePhosphorus:                filterNutrient(food.full_nutrients, 305, 'value'),
  vitamin_d:                      filterNutrient(food.full_nutrients, 324, 'value')
});

const getMultipleFoodsLabelAttributes = (total: Record<string, any>) => ({
  showAmountPerServing:           false,
  showItemName:                   false,
  showServingUnitQuantity:        false,
  showServingUnitQuantityTextbox: false,
  showTransFat:                   false,

  phosphorus:         total.nf_p,
  caffeine:           filterNutrient(total.full_nutrients, 262, 'value'),
  vitamin_d:          filterNutrient(total.full_nutrients, 324, 'value'),
  vitamin_e:          filterNutrient(total.full_nutrients, 323, 'value'),
  vitamin_k:          filterNutrient(total.full_nutrients, 430, 'value'),
  thiamine:           filterNutrient(total.full_nutrients, 404, 'value'),
  riboflavin:         filterNutrient(total.full_nutrients, 405, 'value'),
  niacin:             filterNutrient(total.full_nutrients, 406, 'value'),
  pantothenic_acid:   filterNutrient(total.full_nutrients, 410, 'value'),
  vitamin_b6:         filterNutrient(total.full_nutrients, 415, 'value'),
  vitamin_b12:        filterNutrient(total.full_nutrients, 418, 'value'),
  folic_acid:         filterNutrient(total.full_nutrients, 431, 'value'),
  folate:             filterNutrient(total.full_nutrients, 417, 'value'),
  zinc:               filterNutrient(total.full_nutrients, 309, 'value'),
  magnesium:          filterNutrient(total.full_nutrients, 304, 'value')
});

const useFoodLabel = (food: FoodProps | FoodProps[]) => {
  const [labelData, setLabelData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (Array.isArray(food)) {
      const total = sumFoods(food);
      setLabelData(
        filterFoodToLabel(
          total,
          getMultipleFoodsLabelAttributes(total)
        ) as SetStateAction<Record<string, any>>,
      );
    } else {
      setLabelData(
        filterFoodToLabel(
          food,
          getSingleFoodLabelAttributes(food),
        ) as SetStateAction<Record<string, any>>,
      );
    }
  }, [food]);

  return labelData;
};

export default useFoodLabel;
