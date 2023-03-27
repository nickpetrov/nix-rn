export function round(value: number) {
  if (!value) {
    return value;
  }

  let precision;

  if (value < 1) {
    precision = 2;
  } else if (value < 10) {
    precision = 1;
  } else {
    precision = 0;
  }

  let multiplier = Math.pow(10, precision);

  return Math.round(value * multiplier) / multiplier;
}

export const defaultOption = {
  valueCalories: 0,
  valueServingUnitQuantity: 0,
  showLegacyVersion: false,
  useBaseValueFor2018LabelAndNotDVPercentage: true,
  hideModeSwitcher: true,
  allowFDARounding: false,
  applyMathRounding: true,
  legacyVersion: 2,
  calorieIntake: 2000,
  adjustUserDailyValues: true,
  dailyValueTotalFat: 78,
  dailyValueSodium: 2300,
  dailyValueCarb: 275,
  dailyValueFiber: 28,
};
