import apiClient from 'api';
import {FoodProps} from 'store/userLog/userLog.types';

const customFoodsService = {
  async getCustomFoods(limit: number, offset: number) {
    return await apiClient.get('custom_foods', {
      params: {
        limit,
        offset,
      },
      headers: {
        'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a',
      },
    });
  },
  async updateCustomFoods(recipe: FoodProps) {
    return await apiClient.put(`recipe/${recipe.id ? recipe.id : ''}`, {
      recipe,
    });
  },
};

export default customFoodsService;
