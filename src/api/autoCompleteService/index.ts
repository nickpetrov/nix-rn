import apiClient from 'api';

const autoCompleteService = {
  async getInstant(search?: string) {
    return await apiClient.get(
      `search/instant${search ? `?query=${search}` : ''}`,
    );
  },
  async getSuggestedFoods(mealType: number) {
    return await apiClient.get(
      `reports/suggested${
        mealType !== undefined && mealType !== -1
          ? `?meal_types=[${mealType}]`
          : ''
      }`,
    );
  },
};

export default autoCompleteService;
