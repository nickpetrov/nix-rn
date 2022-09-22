import apiClient from 'api';
import {UpdateRecipeProps} from 'store/recipes/recipes.types';

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
  async updateRecipe(recipe: UpdateRecipeProps) {
    return await apiClient.put(`recipe/${recipe.id || ''}`, {
      recipe,
    });
  },
  async getIngridients(query: string) {
    return await apiClient.post(
      'natural/nutrients',
      {
        query,
        line_delimited: true,
        use_raw_foods: true,
      },
      {
        headers: {
          'x-3scale-bypass': 'c49e69471a7b51beb2bb0e452ef53867385f7a5a',
        },
      },
    );
  },
};

export default recipesService;
