export const multiply = (foodObj: any, multiplier: number, newQty: number) => {
  if (!multiplier) return;

  function nutrientMultiply(fullNutrientArray: any) {
    if (fullNutrientArray.length < 1 || !fullNutrientArray) {
      return [];
    } else {
      return fullNutrientArray.map((nutrient: any) => {
        nutrient.value = +(nutrient.value * multiplier).toFixed(2);
        return nutrient;
      });
    }
  }

  return {
    ...foodObj,
    ...{
      nf_calories: +(foodObj.nf_calories * multiplier).toFixed(2),
      serving_qty: newQty,
      full_nutrients: nutrientMultiply(foodObj.full_nutrients) || [],
      nf_total_fat: +(foodObj.nf_total_fat * multiplier).toFixed(2),
      nf_saturated_fat: +(foodObj.nf_saturated_fat * multiplier).toFixed(2),
      nf_cholesterol: +(foodObj.nf_cholesterol * multiplier).toFixed(2),
      nf_sodium: +(foodObj.nf_sodium * multiplier).toFixed(2),
      nf_total_carbohydrate: +(
        foodObj.nf_total_carbohydrate * multiplier
      ).toFixed(2),
      nf_dietary_fiber: +(foodObj.nf_dietary_fiber * multiplier).toFixed(2),
      nf_sugars: +(foodObj.nf_sugars * multiplier).toFixed(2),
      nf_protein: +(foodObj.nf_protein * multiplier).toFixed(2),
      nf_potassium: +(foodObj.nf_potassium * multiplier).toFixed(2),
      consumed_at: foodObj.consumed_at,
      serving_weight_grams: +(
        (foodObj.serving_weight_grams || foodObj.nf_serving_weight_grams || 0) *
        multiplier
      ).toFixed(2),
      tags: foodObj.tags || null,
      nf_p: +(foodObj.nf_p * multiplier).toFixed(2),
    },
  };
};
