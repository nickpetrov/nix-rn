import _ from 'lodash';

export const filterNutrient = (
  nutrients: any,
  id: any,
  attribute?: string,
): any | null => {
  let i;
  id = parseInt(id);
  if (id && _.isArray(nutrients)) {
    for (i in nutrients)
      if (nutrients.hasOwnProperty(i)) {
        if (parseInt(nutrients[i].attr_id) === id) {
          return attribute ? nutrients[i][attribute] : nutrients[i];
        }
      }
  }

  return null;
};

export const sumFoods = (foods: any[]) => {

  function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  let sum: any = {
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

  _.forEach(foods, function (food) {
    _.forEach(food, function (value, key) {
      if (
        isNumeric(value) &&
        (key === 'serving_weight_grams' ||
          (key !== 'nf_ingredient_statement' && key.substr(0, 3) === 'nf_'))
      ) {
        sum[key] = (sum[key] || 0) + parseFloat(value);
      }
    });

    _.forEach(food.full_nutrients, function (nutrient) {
      var sumNutrient = filterNutrient(
        sum.full_nutrients,
        nutrient.attr_id,
      );

      if (sumNutrient) {
        if (sumNutrient.value !== null || nutrient.value !== null) {
          sumNutrient.value =
            parseFloat(sumNutrient.value || 0) +
            parseFloat(nutrient.value || 0);
        }
      } else {
        sum.full_nutrients.push(_.cloneDeep(nutrient));
      }
    });
  });

  return sum;
};
