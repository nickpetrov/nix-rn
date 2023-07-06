import {useState, useEffect, SetStateAction} from 'react';

import {FoodProps} from 'store/userLog/userLog.types';
import {createFoodLabelData} from 'helpers/filters';
import {filterNutrient, sumFoods} from 'helpers/filters';

const setSingleGlobalOptions = (food: FoodProps) => ({
  showAmountPerServing: false,
  showItemName: false,
  showServingUnitQuantity: false,
  showServingUnitQuantityTextbox: false,
  showTransFat: false,
  valueAddedSugars: filterNutrient(food.full_nutrients, 539, 'value'),
  valuePhosphorus: filterNutrient(food.full_nutrients, 305, 'value'),
  vitamin_d: filterNutrient(food.full_nutrients, 324, 'value'),
  net_carbs: (food?.nf_total_carbohydrate || 0) - (food?.nf_dietary_fiber || 0),
});

const setTotalGlobalOptions = (total: Record<string, any>) => ({
  showAmountPerServing: false,
  showItemName: false,
  showServingUnitQuantity: false,
  showServingUnitQuantityTextbox: false,
  showTransFat: false,
  phosphorus: total.nf_p,
  valueAddedSugars: filterNutrient(total.full_nutrients, 539, 'value'),
  caffeine: filterNutrient(total.full_nutrients, 262, 'value'),
  vitamin_d: filterNutrient(total.full_nutrients, 324, 'value'),
  vitamin_e: filterNutrient(total.full_nutrients, 323, 'value'),
  vitamin_k: filterNutrient(total.full_nutrients, 430, 'value'),
  thiamine: filterNutrient(total.full_nutrients, 404, 'value'),
  riboflavin: filterNutrient(total.full_nutrients, 405, 'value'),
  niacin: filterNutrient(total.full_nutrients, 406, 'value'),
  pantothenic_acid: filterNutrient(total.full_nutrients, 410, 'value'),
  vitamin_b6: filterNutrient(total.full_nutrients, 415, 'value'),
  vitamin_b12: filterNutrient(total.full_nutrients, 418, 'value'),
  folic_acid: filterNutrient(total.full_nutrients, 431, 'value'),
  folate: filterNutrient(total.full_nutrients, 417, 'value'),
  zinc: filterNutrient(total.full_nutrients, 309, 'value'),
  magnesium: filterNutrient(total.full_nutrients, 304, 'value'),
  net_carbs:
    (total?.nf_total_carbohydrate || 0) - (total?.nf_dietary_fiber || 0),
});

const useFoodLabel = (food: FoodProps | FoodProps[]) => {
  const [labelData, setLabelData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (Array.isArray(food)) {
      const total = sumFoods(food);
      setLabelData(
        createFoodLabelData(
          total,
          setTotalGlobalOptions(total),
        ) as SetStateAction<Record<string, any>>,
      );
    } else {
      setLabelData(
        createFoodLabelData(
          food,
          setSingleGlobalOptions(food),
        ) as SetStateAction<Record<string, any>>,
      );
    }
  }, [food]);

  return labelData;
};

export default useFoodLabel;
