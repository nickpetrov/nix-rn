import apiClient from 'api';

const recipesService = {
  async getRecipes(limit: number, offset: number) {
    return await apiClient.get('recipe', {
      params: {
        limit,
        offset,
      },
      headers: {
        'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a',
      },
    });
  },
};

export default recipesService;
