import apiClient from 'api';

const autoCompleteService = {
  async getInstant(search?: string) {
    return await apiClient.get('search/instant', {
      params: {
        query: search,
      },
    });
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
