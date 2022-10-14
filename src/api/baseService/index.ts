import apiClient from 'api';
import {
  RestaurantsProps,
  RestaurantsWithCalcProps,
} from 'store/foods/foods.types';
import {FoodProps} from 'store/userLog/userLog.types';

// types
import {NutritionType} from './types';

const baseService = {
  async getNutrionTopics() {
    return await apiClient.get<{topics: Array<NutritionType>}>(
      'nutrition_topics',
    );
  },
  async getFoodByQRcode(searchValue: string) {
    return await apiClient.get<{foods: Array<FoodProps>}>('/search/item', {
      params: {
        upc: searchValue,
      },
      headers: {
        'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a',
        'x-app-key': '59bcfe12c0e9965162798a31ff38ec1f',
        'x-app-id': '906641bd',
      },
    });
  },
  async getSuggestedFood() {
    return await apiClient.get('recommended_products.json.gz', {
      baseURL: 'https://nix-export.s3.amazonaws.com/',
      headers: {
        'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a',
      },
    });
  },
  async getBrandRestorants() {
    return await apiClient.get<RestaurantsProps>('brands-restaurant.json.gz', {
      baseURL: 'https://nix-export.s3.amazonaws.com/',
    });
  },
  async getRestorantsWithCalc() {
    return await apiClient.get<RestaurantsWithCalcProps>(
      'restaurant-calculators.json.gz',
      {
        baseURL: 'https://d1gvlspmcma3iu.cloudfront.net/',
      },
    );
  },
  async uploadImage(entity: string, id: string, data: File) {
    return await apiClient.post(`upload/image/${entity}/${id}`, data, {
      headers: {
        'Content-Type': data.type,
      },
    });
  },
  async shareMeal(foodId: string, shareKey: string) {
    return await apiClient.get(`share/food/${foodId}/${shareKey}`);
  },
};

export default baseService;
