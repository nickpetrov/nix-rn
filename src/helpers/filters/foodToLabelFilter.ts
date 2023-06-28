const DEFAULT_LABELS = {
  itemName: 'Item',
  brandName: 'Nutritionix',
  allowFDARounding: false,
  applyMathRounding: true,
  valueServingUnitQuantity: 1,
  valueServingSizeUnit: 'Serving',
  showIngredients: false,
};

const LABEL_ATTRIBUTES = [
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

export const filterFoodToLabel = (
  food: any,
  attributes: any,
  nutritionLabelGlobalOptions: Record<string, any>,
  externalServingQty: number = 1,
) => {
  if (!+externalServingQty) {
    externalServingQty = 1;
  }

  const full_nutrients: any[] = food.full_nutrients.map((nutrient: any) => {
    nutrient.value /= externalServingQty;
  });
  const itemName = (food.food_name || '').replace(
    /^([a-z])|\s+([a-z])/g,
    (s: string) => s.toUpperCase(),
  );

  const labelData: Record<string, any> = {
    full_nutrients,
    itemName,
    brandName: food.brand_name,
    valueServingUnitQuantity: food.serving_qty,
    valueServingSizeUnit: food.serving_unit,
    valueServingWeightGrams: food.serving_weight_grams / externalServingQty,
  };

  LABEL_ATTRIBUTES.forEach(definition => {
    let value = $filter('nutrient')(
      food.full_nutrients,
      definition.attrId,
      'value',
    );

    if (value) {
      labelData[definition.labelAttribute] = value / externalServingQty;

      labelData[definition.labelAttribute.replace('value', 'show')] = true;
    } else {
      labelData[definition.labelAttribute.replace('value', 'show')] = false;
    }
  });

  Object.assign(labelData, attributes);
  const resultLabelData = Object.entries(DEFAULT_LABELS).map(([key, value]) => {
    if (!labelData[key] && !nutritionLabelGlobalOptions[key]) {
      labelData[key] = value;
    }
  });

  return resultLabelData;
};
