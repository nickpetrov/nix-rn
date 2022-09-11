export const ADD_FOOD_TO_BASKET = 'ADD_FOOD_TO_BASKET';
export const CHANGE_LOGGING_TYPE = 'CHANGE_LOGGING_TYPE';
export const CHANGE_RECIPE_NAME = 'CHANGE_RECIPE_NAME';
export const CHANGE_RECIPE_SERVINGS = 'CHANGE_RECIPE_SERVINGS';
export const CHANGE_RECIPE_BRAND = 'CHANGE_RECIPE_BRAND';
export const CHANGE_CONSUMED_AT = 'CHANGE_CONSUMED_AT';
export const CHANGE_MEAL_TYPE = 'CHANGE_MEAL_TYPE';
export const RESET = 'RESET';

export const addFoodToBasket = (foods: any[]) => {
  return {type: ADD_FOOD_TO_BASKET, foods};
};

export const changeLoggingType = (isSingleFood: boolean) => {
  return {type: CHANGE_LOGGING_TYPE, isSingleFood};
};

export const changeRecipeName = (newName: string) => {
  return {type: CHANGE_RECIPE_NAME, newName};
};

export const changeRecipeServings = (servings: any[]) => {
  return {type: CHANGE_RECIPE_SERVINGS, servings};
};

export const changeRecipeBrand = (recipeBrand: string) => {
  return {type: CHANGE_RECIPE_BRAND, recipeBrand};
};

export const changeConsumedAt = (consumed_at: string) => {
  return {type: CHANGE_CONSUMED_AT, consumed_at};
};

export const changeMealType = (newMealType: string) => {
  return {type: CHANGE_MEAL_TYPE, newMealType};
};

export const reset = () => {
  return {type: RESET};
};
