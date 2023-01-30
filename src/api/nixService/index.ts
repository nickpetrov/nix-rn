import apiClient from 'api';
import {Platform} from 'react-native';

const baseUrl = 'https://api.nutritionix.com/v1_1/';
const nix_id = '906641bd';
const android_api_key = '6f9ab12f0eadc5a6f115d6fb9e204613';
const ios_api_key = '59bcfe12c0e9965162798a31ff38ec1f';

const nixService = {
  async getRestaurantFoods(
    query: string,
    brand_id: string,
    start?: number,
    step?: number,
  ) {
    start = start || 0;
    step = step || 20;
    query = query || '*';

    const data = {
      offset: start,
      limit: step,
      sort: {
        field: 'item_name.sortable_na',
        order: 'asc',
      },
      filters: {
        brand_id: brand_id,
      },
      query: query,
      fields: ['*'],
      appId: '906641bd',
      appKey: Platform.OS === 'android' ? android_api_key : ios_api_key,
    };
    return await apiClient.post('search', data, {
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  async getGroceryFoods(query: string, start?: number, end?: number) {
    start = start || 0;
    end = end || 20;
    const data = {
      appId: nix_id,
      appKey: Platform.OS === 'android' ? android_api_key : ios_api_key,
      query: query,
      fields: ['*'],
      offset: start,
      limit: end,
      sort: {
        field: '_score',
        order: 'desc',
      },
      filters: {
        item_type: 2,
      },
    };
    return await apiClient.post('search', data, {
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default nixService;
