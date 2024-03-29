import apiClient from 'api';
import {SearchResponse} from 'store/autoComplete/autoComplete.types';
import {captureException} from '@sentry/react-native';

export interface InstantQueryDataProps {
  query: string;
  brand_ids?: Array<string>;
  self?: boolean;
  common?: boolean;
  branded?: boolean;
  detailed?: boolean;
  branded_type?: number;
  common_grocery?: boolean;
}

const autoCompleteService = {
  async getFoodById(id: string) {
    return await apiClient.get(`log/${id}/detailed`);
  },
  async getInstant(data?: InstantQueryDataProps) {
    return await apiClient.get<SearchResponse>('search/instant', {
      params: data,
    });
  },
  async getTrackInstant(data: InstantQueryDataProps) {
    return await apiClient.post<SearchResponse>(
      'search/instant',
      {
        ...data,
      },
      {
        headers: {
          'x-app-id': '906641bd',
          'x-app-key': '59bcfe12c0e9965162798a31ff38ec1f',
        },
      },
    );
  },
  async getSuggestedFoods(mealType: number) {
    return await apiClient.get('reports/suggested', {
      params: {
        meal_types:
          mealType !== undefined && mealType !== -1 ? mealType : undefined,
      },
    });
  },
  async logAutocompleteStats(
    input: string,
    source: number,
    result_key: string,
  ) {
    var data = {
      meta: {
        input: input,
        source: source,
        result_key: result_key,
      },
    };

    return await apiClient
      .post('stats/log', data, {
        headers: {
          'x-app-id': '906641bd',
          'x-app-key': '59bcfe12c0e9965162798a31ff38ec1f',
        },
      })
      .catch(err => {
        console.log('logAutocompleteStats error', err);
        if (err?.status !== 0) {
          captureException(err);
        }
      });
  },
};

export default autoCompleteService;
