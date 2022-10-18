import {mealTypes} from 'store/basket/basket.types';
import {mealNameProps} from 'store/userLog/userLog.types';

const mealsList: Array<mealNameProps> = [
  'Breakfast', //1
  'AM Snack', //2
  'Lunch', //3
  'PM Snack', //4
  'Dinner', //5
  'Late Snack', //6
];

export const guessMealTypeByTime = (hour: number) => {
  if (!hour) hour = 0;

  if (hour >= 4 && hour < 10) {
    return 1;
  } else if (hour >= 10 && hour < 12) {
    return 2;
  } else if (hour >= 12 && hour < 15) {
    return 3;
  } else if (hour >= 15 && hour < 17) {
    return 4;
  } else if (hour >= 17 && hour < 21) {
    return 5;
  } else {
    return 6;
  }
};

export const guessMealNameByType = (type: mealTypes) => {
  return mealsList[type - 1];
};
