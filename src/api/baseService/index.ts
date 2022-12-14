import apiClient from 'api';
import {grocery_photo_upload} from 'config/index';
import {BugReportType} from 'store/base/base.types';
import {
  RestaurantsProps,
  RestaurantsWithCalcProps,
  SuggestedFoodProps,
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
  async getBrandedFoodsById(id: string) {
    return await apiClient.get<{foods: Array<FoodProps>}>('/search/item', {
      params: {
        nix_item_id: id,
      },
      headers: {
        'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a',
        'x-app-key': '59bcfe12c0e9965162798a31ff38ec1f',
        'x-app-id': '906641bd',
      },
    });
  },
  async getSuggestedFood() {
    return await apiClient.get<{products: SuggestedFoodProps[]}>(
      'recommended_products.json.gz',
      {
        baseURL: 'https://nix-export.s3.amazonaws.com/',
        headers: {
          'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a',
        },
      },
    );
  },
  async getBrandRestorants() {
    return await apiClient.get<RestaurantsProps[]>(
      'brands-restaurant.json.gz',
      {
        baseURL: 'https://nix-export.s3.amazonaws.com/',
      },
    );
  },
  async getRestorantsWithCalc() {
    return await apiClient.get<RestaurantsWithCalcProps[]>(
      'restaurant-calculators.json.gz',
      {
        baseURL: 'https://d1gvlspmcma3iu.cloudfront.net/',
      },
    );
  },
  async uploadImage(entity: string, id: string, data: FormData) {
    return await apiClient.post(`upload/image/${entity}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  async shareMeal(foodId: string, shareKey: string) {
    return await apiClient.get(`share/food/${foodId}/${shareKey}`);
  },
  async sendBugReport(data: BugReportType) {
    return await apiClient.post('feedback', data);
  },
  async getGroceryPhotoUploadUPCList() {
    return await apiClient.get('', {
      baseURL: grocery_photo_upload.upc_list,
    });
  },
};

export default baseService;
