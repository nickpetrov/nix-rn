import {useState, useEffect} from 'react';
import {FoodProps} from 'store/userLog/userLog.types';
import getAttrValueById from 'helpers/getAttrValueById';
import nixApiDataUtilites from 'helpers/nixApiDataUtilites/nixApiDataUtilites';
import {useSelector} from 'hooks/useRedux';

const useFoodLabel = (food: FoodProps) => {
  const userData = useSelector(state => state.auth.userData);
  const [total, setTotal] = useState<Record<string, any>>({
    item_name: 'Total',
    brand_name: 'Nutritionix',
    full_nutrients: [],
    metric_qty: 0,
    calories: 0,
    total_fat: 0,
    nf_saturated_fat: 0,
    nf_cholesterol: 0,
    nf_sodium: 0,
    nf_total_carbohydrate: 0,
    nf_dietary_fiber: 0,
    nf_sugars: 0,
    nf_protein: 0,
    nf_potassium: 0,
    nf_vitamin_a_dv: 0,
    nf_vitamin_c_dv: 0,
    nf_calcium_dv: 0,
    nf_iron_dv: 0,
    nf_p: 0,
    caffeine: 0,
    alcohol: 0,
    vitamin_d: 0,
    vitamin_e: 0,
    vitamin_k: 0,
    thiamine: 0,
    riboflavin: 0,
    niacin: 0,
    pantothenic_acid: 0,
    vitamin_b6: 0,
    vitamin_b12: 0,
    folic_acid: 0,
    folate: 0,
    zinc: 0,
    magnesium: 0,
    net_carbs: 0,
    totalCalForPieChart: 0,
  });

  useEffect(() => {
    setTotal(prev => {
      const newTotal: Record<string, any> = {...prev};

      var foodExtendedNf =
        nixApiDataUtilites.convertFullNutrientsToNfAttributes(
          food.full_nutrients,
        );

      newTotal.metric_qty = foodExtendedNf.serving_weight_grams;
      newTotal.calories = foodExtendedNf.nf_calories;
      newTotal.total_fat = foodExtendedNf.nf_total_fat;
      newTotal.nf_saturated_fat = foodExtendedNf.nf_saturated_fat;
      newTotal.nf_cholesterol = foodExtendedNf.nf_cholesterol;
      newTotal.nf_sodium = foodExtendedNf.nf_sodium;
      newTotal.nf_total_carbohydrate = foodExtendedNf.nf_total_carbohydrate;
      newTotal.nf_dietary_fiber = foodExtendedNf.nf_dietary_fiber;
      newTotal.nf_sugars = foodExtendedNf.nf_sugars;
      newTotal.nf_protein = foodExtendedNf.nf_protein;
      newTotal.nf_p = foodExtendedNf.nf_p;
      newTotal.nf_potassium = foodExtendedNf.nf_potassium;
      newTotal.nf_vitamin_a_dv = foodExtendedNf.nf_vitamin_a_dv || 0;
      newTotal.nf_vitamin_c_dv = foodExtendedNf.nf_vitamin_c_dv || 0;
      newTotal.nf_vitamin_d_dv = foodExtendedNf.nf_vitamin_d_dv || 0;
      newTotal.nf_calcium_dv = foodExtendedNf.nf_calcium_dv || 0;
      newTotal.nf_iron_dv = foodExtendedNf.nf_iron_dv || 0;
      newTotal.caffeine = getAttrValueById(food.full_nutrients, 262) || 0;
      newTotal.vitamin_d = getAttrValueById(food.full_nutrients, 324) || 0;
      if (
        newTotal.nf_total_carbohydrate === 0 ||
        newTotal.nf_total_carbohydrate - newTotal.nf_dietary_fiber <= 0
      ) {
        newTotal.net_carbs = 0;
      } else {
        newTotal.net_carbs =
          newTotal.nf_total_carbohydrate - newTotal.nf_dietary_fiber;
      }
      newTotal.serving_qty = 1;
      newTotal.serving_unit = 'Serving';
      newTotal.showItemName = false;
      newTotal.showServingUnitQuantity = false;
      newTotal.showServingUnitQuantityTextbox = false;
      return newTotal;
    });
  }, [food]);

  const labelData = {
    showLegacyVersion: false,
    useBaseValueFor2018LabelAndNotDVPercentage: true,
    hideModeSwitcher: true,
    showItemName: false,
    showServingUnitQuantity: false,
    allowCustomWidth: true,
    showServingUnitQuantityTextbox: false,
    textNutritionFacts: '',
    showDisclaimer: false,
    adjustUserDailyValues: true,
    allowFDARounding: false,
    applyMathRounding: true,
    brandName: 'Nutritionix',
    decimalPlacesForQuantityTextbox: 2,
    scrollLongItemNamePixel: 38,
    showAmountPerServing: false,
    showCalcium: true,
    showCalories: true,
    showCholesterol: true,
    showFatCalories: true,
    showFibers: true,
    showIngredients: false,
    showIron: true,
    showMonoFat: false,
    showPolyFat: false,
    showProteins: true,
    showSatFat: true,
    showServingSize: true,
    showServingsPerContainer: false,
    showSodium: true,
    showSugars: true,
    showTotalCarb: true,
    showTotalFat: true,
    showTransFat: false,
    showVitaminA: true,
    showVitaminC: true,
    valueServingUnitQuantity: total.serving_qty,
    valueServingSizeUnit: total.serving_unit,

    valueCalories: total.calories,
    valueFatCalories: total.total_fat * 9,
    valueTotalFat: total.total_fat,
    valueSatFat: total.nf_saturated_fat,
    valueCholesterol: total.nf_cholesterol,
    valueSodium: total.nf_sodium,
    valueTotalCarb: total.nf_total_carbohydrate,
    valueFibers: total.nf_dietary_fiber,
    valueSugars: total.nf_sugars,
    valueProteins: total.nf_protein,
    valueVitaminA: total.nf_vitamin_a_dv,
    valueVitaminC: total.nf_vitamin_c_dv,
    valueVitaminD: total.nf_vitamin_d_dv,
    valueCalcium: total.nf_calcium_dv,
    valueIron: total.nf_iron_dv,
    valuePotassium_2018: total.nf_potassium,

    calorieIntake: userData.daily_kcal || 0,
  };
  return total.serving_qty ? {labelData, total} : null;
};

export default useFoodLabel;
