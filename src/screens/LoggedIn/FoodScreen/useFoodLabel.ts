import {useState, useEffect, SetStateAction} from 'react';
import {FoodProps} from 'store/userLog/userLog.types';
import {useSelector} from 'hooks/useRedux';
import {createFoodLabelData} from 'helpers/filters';

const useFoodLabel = (food: FoodProps) => {
  const userData = useSelector(state => state.auth.userData);
  const [labelData, setLabelData] = useState<Record<string, any>>({
    showItemName: false,
    showServingUnitQuantity: false,
    allowCustomWidth: true,
    showServingUnitQuantityTextbox: false,
    textNutritionFacts: '',
    showDisclaimer: false,
    showIngredients: false,
    decimalPlacesForQuantityTextbox: 2,
    scrollLongItemNamePixel: 38,
    showAmountPerServing: false,
    dailyValueTotalFat: 78,
    dailyValueSodium: 2300,
    dailyValueCarb: 275,
    dailyValueFiber: 28,
    valueServingUnitQuantity: 1,
    valueServingSizeUnit: 'Serving',
    calorieIntake: userData.daily_kcal || 2000,
    valueServingWeightGrams: food.serving_weight_grams,
  });

  useEffect(() => {
    if (food) {
      setLabelData(
        createFoodLabelData(food) as SetStateAction<Record<string, any>>,
      );
    }
  }, [food]);

  return labelData;
};

export default useFoodLabel;
