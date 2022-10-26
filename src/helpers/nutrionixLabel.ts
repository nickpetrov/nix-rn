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
  valueCalories: 100,
  valueServingUnitQuantity: 1,
  showLegacyVersion: false,
};
