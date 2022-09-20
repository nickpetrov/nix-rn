import apiClient from 'api';
import {FoodProps} from 'store/userLog/userLog.types';

// types
import {NutritionType} from './types';

const baseService = {
  async getNutrionTopics() {
    return await apiClient.get<Array<NutritionType>>('nutrition_topics');
  },
  async getFoodByQRcode(searchValue: string) {
    return await apiClient.get<{foods: Array<FoodProps>}>(
      `/search/item?upc=${searchValue}`,
      {
        headers: {
          'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a',
        },
        data: {
          appKey: '59bcfe12c0e9965162798a31ff38ec1f',
          appId: '906641bd',
        },
      },
    );
  },
};

export default baseService;
