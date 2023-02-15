import moment from 'moment-timezone';
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

export const capitalize = (sentence: string) => {
  const words = (sentence || '').trim().split(' ');

  return words
    .map((word: string) => {
      return word[0]?.toUpperCase() + word?.substring(1);
    })
    .join(' ');
};

export const calculateConsumedTimestamp = (
  meal_type: number,
  consumed_at?: string | Date,
) => {
  const date = moment(consumed_at);
  let calculateTime = moment(consumed_at).format('YYYY-MM-DDTHH:mm');
  switch (meal_type) {
    case mealTypes.Breakfast:
      calculateTime = date
        .hours(4)
        .minutes(0)
        .seconds(0)
        .format('YYYY-MM-DDTHH:mm');
      return calculateTime;
    case mealTypes['AM Snack']:
      calculateTime = date
        .hours(10)
        .minutes(0)
        .seconds(0)
        .format('YYYY-MM-DDTHH:mm');
      return calculateTime;
    case mealTypes.Lunch:
      calculateTime = date
        .hours(12)
        .minutes(0)
        .seconds(0)
        .format('YYYY-MM-DDTHH:mm');
      return calculateTime;
    case mealTypes['PM Snack']:
      calculateTime = date
        .hours(15)
        .minutes(0)
        .seconds(0)
        .format('YYYY-MM-DDTHH:mm');
      return calculateTime;
    case mealTypes.Dinner:
      calculateTime = date
        .hours(17)
        .minutes(0)
        .seconds(0)
        .format('YYYY-MM-DDTHH:mm');
      return calculateTime;
    case mealTypes['Late Snack']:
      calculateTime = date
        .hours(21)
        .minutes(0)
        .seconds(0)
        .format('YYYY-MM-DDTHH:mm');
      return calculateTime;
    default:
      return calculateTime;
  }
};
