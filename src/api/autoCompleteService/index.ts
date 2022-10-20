import apiClient from 'api';
export interface InstantQueryDataProps {
  query: string;
  brand_ids?: Array<number>;
  self?: boolean;
  common?: boolean;
  branded?: boolean;
  detailed?: boolean;
  branded_type?: number;
}

const autoCompleteService = {
  async getFoodById(id: string) {
    return await apiClient.get(`log/${id}/detailed`);
  },
  async getInstant(search?: string) {
    return await apiClient.get('search/instant', {
      params: {
        query: search,
      },
    });
  },
  async getTrackInstant(data: InstantQueryDataProps) {
    return await apiClient.post(
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
};

export default autoCompleteService;
