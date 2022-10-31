import apiClient from 'api';
import {UpdateCustomFoodProps} from 'store/customFoods/customFoods.types';

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
  async updateOrCreateCustomFoods(custom_food: UpdateCustomFoodProps) {
    return await apiClient[custom_food.id ? 'put' : 'post'](
      `custom_foods/${custom_food.id || ''}`,
      {
        custom_food,
      },
    );
  },
  async getCustomFoodById(id: string) {
    return await apiClient.get(`custom_foods/${id}`);
  },
  async deleteCustomFood(id: string) {
    return await apiClient.delete(`custom_foods/${id}`);
  },
};

export default customFoodsService;
