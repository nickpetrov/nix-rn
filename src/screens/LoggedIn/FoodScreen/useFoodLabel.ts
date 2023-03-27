import {useState, useEffect} from 'react';
import getAttrValueById from 'helpers/getAttrValueById';
import {FoodProps} from 'store/userLog/userLog.types';
import {useSelector} from 'hooks/useRedux';
import cloneDeep from 'lodash/cloneDeep';

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
    const map = [
      {labelAttribute: 'valueCalories', attrId: 208},
      {labelAttribute: 'valueTotalFat', attrId: 204},
      {labelAttribute: 'valueSatFat', attrId: 606},
      {labelAttribute: 'valueTransFat', attrId: 605},
      {labelAttribute: 'valueMonoFat', attrId: 645},
      {labelAttribute: 'valuePolyFat', attrId: 646},
      {labelAttribute: 'valueCholesterol', attrId: 601},
      {labelAttribute: 'valueSodium', attrId: 307},
      {labelAttribute: 'valuePotassium', attrId: 306},
      {labelAttribute: 'valuePotassium_2018', attrId: 306},
      {labelAttribute: 'valueTotalCarb', attrId: 205},
      {labelAttribute: 'valueFibers', attrId: 291},
      {labelAttribute: 'valueSugars', attrId: 269},
      {labelAttribute: 'valueAddedSugars', attrId: 539},
      {labelAttribute: 'valueProteins', attrId: 203},
      {labelAttribute: 'valueVitaminA', attrId: 318},
      {labelAttribute: 'valueVitaminC', attrId: 401},
      {labelAttribute: 'valueVitaminD', attrId: 328},
      {labelAttribute: 'valueCalcium', attrId: 301},
      {labelAttribute: 'valueIron', attrId: 303},
      {labelAttribute: 'valueCaffeine', attrId: 262},
    ];
    setLabelData(prev => {
      const newLabelData: Record<string, any> = {...prev};
      const full_nutrients = cloneDeep(food?.full_nutrients) || [];

      map.forEach(definition => {
        const value = getAttrValueById(full_nutrients, definition.attrId) || 0;

        if (value) {
          newLabelData[definition.labelAttribute] = value;

          newLabelData[definition.labelAttribute.replace('value', 'show')] =
            true;
        } else {
          newLabelData[definition.labelAttribute.replace('value', 'show')] =
            false;
        }
      });
      return newLabelData;
    });
  }, [food]);

  return labelData;
};

export default useFoodLabel;
