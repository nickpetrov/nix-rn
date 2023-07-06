export const filterNutrient = (
  nutrients: any,
  id: number,
  attribute?: string,
): any | null => {
  let i;
  if (id && Array.isArray(nutrients)) {
    for (i in nutrients) {
      if (nutrients.hasOwnProperty(i)) {
        if (Number.parseInt(nutrients[i].attr_id, 10) === id) {
          return attribute ? nutrients[i][attribute] : nutrients[i];
        }
      }
    }
  }
  return null;
};

export const sumFoods = (foods: any[]) => {
  let sum: Record<string, any> = {
    serving_qty: 1,
    serving_unit: 'Serving',
    full_nutrients: [],
    nf_ingredient_statement:
      foods
        .map(function (f) {
          return f.nf_ingredient_statement || '';
        })
        .filter(function (ns) {
          return !!ns;
        })
        .join('\n')
        .trim() || null,
  };

  foods.forEach(function (food) {
    Object.entries(food).forEach(([value, key]: any) => {
      if (
        typeof value === 'number' &&
        (key === 'serving_weight_grams' ||
          (key !== 'nf_ingredient_statement' && key.substr(0, 3) === 'nf_'))
      ) {
        sum[key] = (sum[key] || 0) + value;
      }
    });

    food.full_nutrients.forEach(function (nutrient: any) {
      var sumNutrient = filterNutrient(sum.full_nutrients, nutrient.attr_id);

      if (sumNutrient) {
        if (sumNutrient.value !== null || nutrient.value !== null) {
          sumNutrient.value =
            parseFloat(sumNutrient.value || 0) +
            parseFloat(nutrient.value || 0);
        }
      } else {
        sum.full_nutrients.push({...nutrient});
      }
    });
  });

  return sum;
};
