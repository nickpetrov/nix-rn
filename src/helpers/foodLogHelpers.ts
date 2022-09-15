import {
  FoodProps,
  mealNameProps,
  SortedFoodProps,
} from 'store/userLog/userLog.types';
import * as timeHelper from './time.helpers';

const mealsList: Array<mealNameProps> = [
  'Breakfast', //1
  'AM Snack', //2
  'Lunch', //3
  'PM Snack', //4
  'Dinner', //5
  'Late Snack', //6
];

export const sortFoodItem = (
  mealName: string,
  sortedMealList: Array<SortedFoodProps>,
  food: FoodProps,
) => {
  let mealObj = sortedMealList.find(meal => meal.mealName === mealName);
  if (mealObj?.foods) {
    mealObj.foods.push(food);
  }
};

export const sortFoodsByMeal = (
  foodsList: Array<FoodProps> | [] = [],
  selectedDate = '',
): Array<SortedFoodProps> => {
  const sortedFoods: Array<{
    mealName: mealNameProps;
    foods: Array<FoodProps>;
    consumed_at: string;
  }> = [];
  mealsList.map(mealName => {
    sortedFoods.push({mealName, foods: [], consumed_at: ''});
  });
  foodsList.map((food: FoodProps) => {
    if (
      timeHelper.formatDate(food.consumed_at, undefined, 'YYYY-MM-DD') !==
      selectedDate
    ) {
      return; //skip all foods that are not logged on the currently selected date
    }
    switch (food.meal_type) {
      case 1:
        sortFoodItem('Breakfast', sortedFoods, food);
        break;
      case 2:
        sortFoodItem('AM Snack', sortedFoods, food);
        break;
      case 3:
        sortFoodItem('Lunch', sortedFoods, food);
        break;
      case 4:
        sortFoodItem('PM Snack', sortedFoods, food);
        break;
      case 5:
        sortFoodItem('Dinner', sortedFoods, food);
        break;
      case 6:
        sortFoodItem('Late Snack', sortedFoods, food);
        break;
      default:
        console.log('meal not defined');
    }
  });
  return sortedFoods;
};

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

export const guessMealNameByType = (type: number) => {
  return mealsList[type - 1];
};
