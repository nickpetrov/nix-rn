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
  async getSuggestedFood() {
    return await apiClient.get('recommended_products.json.gz', {
      baseURL: 'https://nix-export.s3.amazonaws.com/',
      headers: {
        'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a',
      },
    });
  },
  async getBrandRestorants() {
    return await apiClient.get('brands-restaurant.json.gz', {
      baseURL: 'https://nix-export.s3.amazonaws.com/',
    });
  },
  async getRestorantsWithCalc() {
    return await apiClient.get('restaurant-calculators.json.gz', {
      baseURL: 'https://d1gvlspmcma3iu.cloudfront.net/',
    });
  },
  async getRestorantsFoodsFromOldApi(brand_id: number) {
    return await apiClient.get('search', {
      baseURL: 'https://api.nutritionix.com/v1_1/',
      data: {
        offset: 0,
        limit: 20,
        sort: {
          field: 'item_name.sortable_na',
          order: 'asc',
        },
        filters: {
          brand_id: brand_id,
        },
        query: '*',
        fields: ['*'],
        appId: '906641bd',
        appKey: '59bcfe12c0e9965162798a31ff38ec1f',
      },
    });
  },
};

export default baseService;
