export const multiply = (foodObj: any, multiplier: number, newQty: number) => {
  if (!multiplier) return;

  function nutrientMultiply(fullNutrientArray: any) {
    if (fullNutrientArray.length < 1 || !fullNutrientArray) {
      return [];
    } else {
      return fullNutrientArray.map((nutrient: any) => {
        nutrient.value = nutrient.value * multiplier;
        return nutrient;
      });
    }
  }

  return {
    ...foodObj,
    ...{
      nf_calories: foodObj.nf_calories * multiplier,
      serving_qty: newQty,
      full_nutrients: nutrientMultiply(foodObj.full_nutrients) || [],
      nf_total_fat: foodObj.nf_total_fat * multiplier,
      nf_saturated_fat: foodObj.nf_saturated_fat * multiplier,
      nf_cholesterol: foodObj.nf_cholesterol * multiplier,
      nf_sodium: foodObj.nf_sodium * multiplier,
      nf_total_carbohydrate: foodObj.nf_total_carbohydrate * multiplier,
      nf_dietary_fiber: foodObj.nf_dietary_fiber * multiplier,
      nf_sugars: foodObj.nf_sugars * multiplier,
      nf_protein: foodObj.nf_protein * multiplier,
      nf_potassium: foodObj.nf_potassium * multiplier,
      consumed_at: foodObj.consumed_at,
      serving_weight_grams:
        (foodObj.serving_weight_grams || foodObj.nf_serving_weight_grams) *
        multiplier,
      tags: foodObj.tags || null,
      nf_p: foodObj.nf_p * multiplier,
    },
  };
};
